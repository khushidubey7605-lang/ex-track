import { Routes } from '@angular/router';

import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './admin/superadmin-dashboard/superadmin-dashboard.component';

export const routes: Routes = [
  // ✅ Default → Register
  { path: '', redirectTo: 'register', pathMatch: 'full' },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Dashboards
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },

  // Fallback
  { path: '**', redirectTo: 'register' }
];
