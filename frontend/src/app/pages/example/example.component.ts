import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ExampleService } from '../../core/services/example.service';
import { Example } from '../../domain/models/example';

@Component({
  selector: 'app-example',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent implements OnInit {
  // Inject services using the modern `inject` function
  private exampleService = inject(ExampleService);
  private fb = inject(FormBuilder);

  // Observable to hold the list of examples
  examples$!: Observable<Example[]>;
  
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
    this.examples$ = this.exampleService.getExamples();
  }

  // Fetches a single example and displays it
  viewExample(id: number): void {
    this.exampleService.getExampleById(id).subscribe({
      next: (data) => this.selectedExample = data,
      error: (err) => console.error('Error fetching example:', err)
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
      },
      error: (err) => console.error('Error creating example:', err)
    });
  }
}
