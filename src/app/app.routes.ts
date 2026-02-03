import { Routes } from '@angular/router';

// Auth
import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

// User pages
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ExpensesComponent } from './user/expenses/expenses/expenses.component';
import { IncomeComponent } from './user/income/income.component';
import { ProfileComponent } from './user/profile/profile/profile.component';
import { LogoutComponent } from './user/logout/logout.component';
import { Reports } from './user/reports/reports/reports';

// Lazy-loaded profile-view
const ProfileViewComponent = () =>
  import('./user/profile-view.component/profile-view.component')
    .then(m => m.ProfileViewComponent);

export const routes: Routes = [
  // Default → go to register (first time user sees register)
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Auth routes (no navbar)
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // User pages (shown only after login)
  { path: 'dashboard', component: DashboardComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'report', component: Reports },

  // Lazy-loaded
  { path: 'profile-view', loadComponent: ProfileViewComponent },

  // Wildcard → redirect to register if user types wrong url
  { path: '**', redirectTo: 'register' }
];
