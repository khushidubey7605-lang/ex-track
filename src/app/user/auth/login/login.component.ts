import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  submitted = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login(form: NgForm) {
    this.submitted = true;

    if (!form.valid) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      await this.auth.login(this.email, this.password);
      alert('Login successful!');
      this.router.navigate(['/dashboard']); // redirect after login
    } catch (err: any) {
      alert(err.message || 'Login failed.');
    }
  }
}
