import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent {
  submitted = false;

  // ✅ Declare these properties for ngModel binding
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  async login(form: NgForm) {
    this.submitted = true;

    if (!form.valid) return;

    try {
      await this.auth.login(this.email, this.password);
      alert('Login successful!');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
