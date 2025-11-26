import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegisterDTO } from '../../DTOs/UserDTOs';

@Component({
  selector: 'app-authlayout',
  imports: [RouterOutlet],
  templateUrl: './authlayout.component.html',
  styleUrl: './authlayout.component.css',
})
export class AuthlayoutComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: UserRegisterDTO) => {
        if (data !== null) this.router.navigate(['welcome']);
      },
    });
  }
}
