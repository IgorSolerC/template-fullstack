import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, Observable, of, Subscription, toArray } from 'rxjs';
import { ExampleService } from '../../core/services/example.service';
import { Example } from '../../domain/models/example';
import { ToastrService } from 'ngx-toastr';

interface ExamplesState {
  data?: Example[];
  error?: any; 
}

@Component({
  selector: 'app-example',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnInit, OnDestroy {
  // Inject services using the modern `inject` function
  private exampleService = inject(ExampleService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  // Observable to hold the list of examples
  examples$!: Observable<ExamplesState>;
  getExampleByIdSubscription: Subscription | null = null;

  // To hold the details of a single fetched example
  selectedExample: Example | null = null;
  
  // Form group for creating a new example
  newExampleForm!: FormGroup;

  ngOnInit(): void {
    // Initialize the form on component load
    this.newExampleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required] 
    });

    // Load the initial list of examples
    this.loadExamples();
  }

  loadExamples(): void {

    this.examples$ = this.exampleService.getExamples().pipe(
      // On success, map the array to the 'data' property of our state object
      map(examples => ({ data: examples })),
      // On error, catch it and return an observable of the state object with the 'error' property set
      catchError(error => of({ error: error }))
    );
  }
  
  viewExample(id: number): void {
    this.getExampleByIdSubscription = this.exampleService.getExampleById(id).subscribe({
      next: (data) => {
        this.selectedExample = data;
        this.toastr.info('Exemplo carregado com sucesso!', 'Info');
      },
      error: (err) => {
        console.error('Error fetching example:', err);
        this.toastr.error((err.error.detail || err.message), 'Erro ao carregar dados');
      }
    });
  }

  // Clears the selected example view
  clearSelection(): void {
    this.selectedExample = null;
  }

  // Handles the form submission
  onSubmit(): void {
    if (this.newExampleForm.invalid) {
      console.error('Form is invalid.');
      return;
    }

    this.exampleService.createExample(this.newExampleForm.value).subscribe({
      next: (newExample) => {
        this.newExampleForm.reset();
        this.loadExamples();
        this.toastr.success('Exemplo cadastrado com sucesso!', 'Sucesso');
      },
      error: (err) => {
        console.error('Error creating example:', err);
        this.toastr.error((err.error.detail || err.message), 'Falha ao cadastrar exemplo');
      }
    });
  }

  ngOnDestroy(): void {
    if(this.getExampleByIdSubscription) {
      this.getExampleByIdSubscription.unsubscribe();
    }
  }
}
