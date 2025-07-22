import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-home',
  imports: [RouterModule,
    FieldsetModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
