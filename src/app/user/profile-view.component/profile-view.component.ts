import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, CurrentUser } from '../../services/auth.service'; // import the type

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  user: CurrentUser | null = null; // use AuthService's CurrentUser type

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }
}
