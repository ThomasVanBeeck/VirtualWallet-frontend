import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserDto } from '../../DTOs/UserDtos';
import { IUserService } from '../../interfaces/i-user.service';
import { USER_SERVICE_TOKEN } from '../../tokens';

@Component({
  selector: 'app-authlayout',
  imports: [RouterOutlet],
  templateUrl: './authlayout.component.html',
  styleUrl: './authlayout.component.css',
})
export class AuthlayoutComponent implements OnInit {
  private userService = inject<IUserService>(USER_SERVICE_TOKEN);
  private router = inject(Router);

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: UserDto) => {
        if (data !== null) this.router.navigate(['welcome']);
      },
    });
  }
}
