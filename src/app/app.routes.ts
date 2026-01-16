import { Routes } from '@angular/router';

import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './admin/superadmin-dashboard/superadmin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // User Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Admin Dashboards
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
