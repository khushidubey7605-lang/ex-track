import { Routes } from '@angular/router';

// Auth Components
import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

// User Components
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { Expenses } from './user/expenses/expenses/expenses';
import { Profile } from './user/profile/profile/profile';

// Layout Components
import { NavbarComponent } from './core/layout/navbar.component/navbar.component'; // check exact path

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
      { path: 'expenses', component: Expenses },
      { path: 'profile', component: Profile },
    ]
  },

  // ===== WILDCARD =====
  { path: '**', redirectTo: 'register' }
];
