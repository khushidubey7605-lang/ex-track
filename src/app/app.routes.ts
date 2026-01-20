import { Routes } from '@angular/router';

// Auth
import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

// User pages
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ExpensesComponent } from './user/expenses/expenses/expenses.component';
import { ProfileComponent } from './user/profile/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Auth (no navbar)
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // User pages (with navbar)
  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'profile', component: ProfileComponent },

  { path: '**', redirectTo: 'register' }
];
