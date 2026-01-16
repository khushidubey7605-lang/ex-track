import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  submitted = false;

  constructor(private auth: AuthService, private router: Router) {}

  async register(form: NgForm) {
    this.submitted = true;

    if (!form.valid) {
      alert('Please fill all required fields.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await this.auth.register(this.name, this.email, this.password);
      alert('Registered successfully!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    }
  }
}
