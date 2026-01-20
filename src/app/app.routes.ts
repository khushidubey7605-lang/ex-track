import { Routes } from '@angular/router';

// Auth Components
import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

// User Components
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ExpensesComponent } from './user/expenses/expenses/expenses.component';
import { ProfileComponent } from './user/profile/profile/profile.component';

// Layout Components
// ✅ correct (folder name ke according)
import { NavbarComponent } from './core/layout/navbar.component/navbar.component';


export const routes: Routes = [
  // ===== AUTH (NO NAVBAR) =====
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // ===== USER PAGES (WITH NAVBAR) =====
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },

  // ===== WILDCARD =====
  { path: '**', redirectTo: 'register' }
];
