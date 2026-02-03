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
import { ReportsComponent } from './user/reports/reports/reports.component';

// Lazy-loaded profile-view
const ProfileViewComponent = () =>
  import('./user/profile-view.component/profile-view.component')
    .then(m => m.ProfileViewComponent);

export const routes: Routes = [
  // Default route
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  // Auth routes
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // User routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'logout', component: LogoutComponent },

  // Lazy-loaded route
  { path: 'profile-view', loadComponent: ProfileViewComponent },

  // Wildcard route
  { path: '**', redirectTo: 'register' }
];
