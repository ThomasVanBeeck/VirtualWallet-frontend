import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  authService = inject(AuthService)
  router = inject(Router)

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log("logout ok")
        this.router.navigate(['login'])
      },
      error: err => console.error("logout  failed", err)
    })
  }

}
