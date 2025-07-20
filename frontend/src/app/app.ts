import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgxSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
