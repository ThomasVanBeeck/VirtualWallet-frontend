import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IAuthService } from '../../interfaces/i-auth.service';
import { AUTH_SERVICE_TOKEN } from '../../tokens';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  private authService = inject<IAuthService>(AUTH_SERVICE_TOKEN);
  private router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('logout ok');
        this.router.navigate(['login']);
      },
      error: (err) => console.error('logout  failed', err),
    });
  }
}
