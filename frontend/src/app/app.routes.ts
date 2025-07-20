import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ExampleComponent } from './pages/example/example.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full'},
            { path: 'home', component: HomeComponent, title: 'Início'},
            { path: 'example', component: ExampleComponent, title: 'Exemplo' },
            { path: '**', component: PageNotFoundComponent, title: 'Página Não Encontrada' }
        ]
    },
];  