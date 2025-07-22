import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, Observable, of, Subscription, toArray } from 'rxjs';
import { ExampleService } from '../../core/services/example.service';
import { Example } from '../../domain/models/example';
import { ToastrService } from 'ngx-toastr';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';

interface ExamplesState {
  data?: Example[];
  error?: any; 
}

@Component({
  selector: 'app-example',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmDialog,
    SkeletonModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnInit, OnDestroy {
  // Inject services using the modern `inject` function
  private exampleService = inject(ExampleService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  modalDeleteExample(event: Event, id: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja deletar este registro?',
      header: 'Confirmação',
      closable: true,
      closeOnEscape: true,
      icon: 'fa-solid fa-triangle-exclamation',
      // Corrected properties for button labels
      acceptLabel: 'Deletar',
      rejectLabel: 'Cancelar',

      // Properties for styling the buttons
      acceptButtonStyleClass: 'btn critical',
      rejectButtonStyleClass: 'btn neutral',
      accept: () => {
        this.deleteExample(id);
      },
      reject: () => {},
    });
  }

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

    this.examples$ = this.exampleService.getExamples({showSpinner: false}).pipe(
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

  createExample(): void {
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

  deleteExample(id: number): void {
    this.exampleService.deleteExample(id).subscribe({
      next: () => {
        this.loadExamples();
        this.clearSelection();
        this.toastr.success('Exemplo deletado com sucesso!', 'Sucesso');
      },
      error: (err) => {
        console.error('Error deleting example:', err);
        this.toastr.error((err.error.detail || err.message), 'Falha ao deletar exemplo');
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

    this.createExample();
  }

  ngOnDestroy(): void {
    if(this.getExampleByIdSubscription) {
      this.getExampleByIdSubscription.unsubscribe();
    }
  }
}
