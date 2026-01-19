import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavbarComponent } from './core/layout/navbar.component/navbar.component'; // ✅ fixed path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  showNavbar = true;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((event: NavigationEnd) => {
        const hideNavbarRoutes = ['/login', '/register'];
        this.showNavbar = !hideNavbarRoutes.includes(event.urlAfterRedirects);
      });
  }
}
