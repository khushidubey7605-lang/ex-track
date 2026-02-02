import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  submitted = false;
  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  async login(form: NgForm) {
    this.submitted = true;
    if (!form.valid) return;

    try {
      // 🔐 Firebase Auth
      const authUser = await this.auth.login(this.email, this.password);

      // 🔥 Firestore se REAL updated profile
      const profile: any = await this.profileService.getProfile();

      // ✅ LocalStorage sirf cache ke liye
      localStorage.setItem('currentUser', JSON.stringify(profile));

      // ✅ Role-based redirect
      if (profile.role === 'user') {
        this.router.navigate(['/dashboard']);
      } 
      else if (profile.role === 'admin') {
        if (profile.status === 'active') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Admin approval pending!');
        }
      } 
      else if (profile.role === 'superadmin') {
        this.router.navigate(['/superadmin-dashboard']);
      }

    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        alert('User not found. Please signup first.');
      } else if (err.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (err.code === 'auth/invalid-credential') {
        alert('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Too many attempts. Try again later.');
      } else {
        alert(err.message || 'Login failed');
      }
    }
  }
}
