import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ExampleComponent } from './pages/example/example.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    // Redirect the root path ('') to the '/home' path
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'example', component: ExampleComponent },
        ]
    },
    { path: '**', component: PageNotFoundComponent }
];  