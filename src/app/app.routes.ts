// import { Routes } from '@angular/router';

import { LoginComponent } from './user/auth/login/login.component';
import { RegisterComponent } from './user/auth/register/register.component';

import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SuperadminDashboardComponent } from './admin/superadmin-dashboard/superadmin-dashboard.component';
import { Routes } from '@angular/router';

// import { NavbarLayoutComponent } from './layout/navbar-layout/navbar-layout.component';

export const routes: Routes = [

  // ====== AUTH ROUTES (No Sidebar) ======
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // ====== DASHBOARD ROUTES (WITH SIDEBAR) ======
  {
    path: '',
    // component: NavbarLayoutComponent,   // <-- IMPORTANT
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'register' }
];
// import { Routes } from '@angular/router';

// import { LoginComponent } from './user/auth/login/login.component';
// import { RegisterComponent } from './user/auth/register/register.component';

// import { DashboardComponent } from './user/dashboard/dashboard.component';
// import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
// import { SuperadminDashboardComponent } from './admin/superadmin-dashboard/superadmin-dashboard.component';

// export const routes: Routes = [

//   { path: '', redirectTo: 'register', pathMatch: 'full' },

//   { path: 'register', component: RegisterComponent },
//   { path: 'login', component: LoginComponent },

//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'admin-dashboard', component: AdminDashboardComponent },
//   { path: 'superadmin-dashboard', component: SuperadminDashboardComponent },

//   { path: '**', redirectTo: 'register' }
// ];
