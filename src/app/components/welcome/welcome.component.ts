import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MarketDataService } from '../../services/market-data.service';
import { UserRegisterDTO } from '../../DTOs/UserDTOs';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [],
})
export class WelcomeComponent implements OnInit {
  public username: string = 'gast';
  public classname: string = 'unchanged';
  public classtoggle: boolean = false;

  userService = inject(UserService);
  marketDataService = inject(MarketDataService);
  router = inject(Router);

  ngOnInit(): void {
    this.fetchUsername();
  }

  changeLayout(): void {
    this.classtoggle = !this.classtoggle;
    if (this.classtoggle) this.classname = 'unchanged';
    else this.classname = 'changed';
  }

  fetchUsername(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data: UserRegisterDTO) => {
        this.username = data.Username;
      },
      error: (err) => {
        console.error('Fout bij ophalen gebruikersnaam:', err);
        this.username = 'username (error)';
        this.router.navigate(['login']);
      },
    });
  }
}
