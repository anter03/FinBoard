import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // reindirizza "" → "login"
  { path: 'login', component: LoginComponent },         // pagina login
];
