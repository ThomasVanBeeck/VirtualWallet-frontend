import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MarketDataService } from '../services/market-data.service';
import { UserModel } from '../models/usermodel';
import { TopbarComponent } from "../topbar/topbar.component";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [TopbarComponent]
})
export class WelcomeComponent implements OnInit {
  public username: string = 'gast';
  public classname: string = "unchanged"
  public classtoggle: boolean = false

  authService = inject(AuthService)
  marketDataService = inject(MarketDataService)

  ngOnInit(): void {
    this.fetchUsername();
  }

  changeLayout(): void {
    this.classtoggle = !this.classtoggle;
    if (this.classtoggle)
      this.classname = "unchanged"
    else this.classname = "changed"
  }

  fetchUsername(): void {
    this.authService.getTestUser().subscribe({
      next: (data: UserModel) => {
        this.username = data.username;
      },
      error: (err) => {
        console.error('Fout bij ophalen gebruikersnaam:', err);
        this.username = 'gebruiker (fout)';
      }
    });
  }


  // fetchUsername(): void {
  //   this.authService.getCurrentUser().subscribe({
  //     next: (data: UserModel) => {
  //       this.username = data.username;
  //     },
  //     error: (err) => {
  //       console.error('Fout bij ophalen gebruikersnaam:', err);
  //       this.username = 'gebruiker (fout)';
  //     }
  //   });
  // }
}