import { Routes } from '@angular/router';

// Auth
import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

// User pages
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ExpensesComponent } from './user/expenses/expenses/expenses.component';
import { ProfileComponent } from './user/profile/profile/profile.component';
import { IncomeComponent } from './user/income/income.component';
import { LogoutComponent } from './user/logout/logout.component';
import { ReportsComponent } from './user/reports/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'reports', component: ReportsComponent }, // ✅ FIXED
  { path: 'profile', component: ProfileComponent },
  { path: 'logout', component: LogoutComponent },

  {
    path: 'profile-view',
    loadComponent: () =>
      import('./user/profile-view.component/profile-view.component')
        .then(m => m.ProfileViewComponent)
  }
];
