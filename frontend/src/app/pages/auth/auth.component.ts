import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../domain/models/user';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule, TabsModule, InputTextModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  // Services
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  // State
  protectedData: any = null;

  allUsers: User[] | null = null;
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Check for Google Auth callback code in the URL
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.handleGoogleCallback(code);
      }
    });
  }

  // --- Form Handlers ---
  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.toastr.success('Login realizado com sucesso!', 'Bem-vindo!'),
      error: (err) => this.toastr.error(err.error?.detail || 'Falha no login', 'Erro')
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.toastr.success('Registro realizado com sucesso! Por favor, faça o login.', 'Sucesso'),
      error: (err) => this.toastr.error(err.error?.detail || 'Falha no registro', 'Erro')
    });
  }
  
  // --- Google Auth ---
  redirectToGoogle(): void {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: environment.googleRedirectUri,
      client_id: environment.googleClientId,
      access_type: 'offline',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    };
    const params = new URLSearchParams(options).toString();
    window.location.href = `${googleAuthUrl}?${params}`;
  }

  private handleGoogleCallback(code: string): void {
    this.authService.loginWithGoogle(code).subscribe({
      next: () => {
        this.toastr.success('Login com Google realizado com sucesso!', 'Bem-vindo!');
        // Clean the URL by removing the code
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { code: null },
          queryParamsHandling: 'merge',
        });
      },
      error: (err) => this.toastr.error(err.error?.detail || 'Falha no login com Google', 'Erro')
    });
  }

  // --- Authenticated Actions ---
  onLogout(): void {
    this.authService.logout();
    this.toastr.info('Você foi desconectado.', 'Até logo!');
  }

  fetchProtectedData(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.toastr.success('Lista de usuários carregada com sucesso!', 'Sucesso');
      },
      error: (err) => {
        this.allUsers = null;
        this.toastr.error(err.error?.detail || 'Você não tem permissão para ver isso.', 'Erro de Autorização');
      }
    });
  }
}