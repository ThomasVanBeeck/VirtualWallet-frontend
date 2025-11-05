import { Component, OnInit } from '@angular/core';
import { UserService, UserData } from '../services/user.service';
import { MarketDataService } from '../market-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  public username: string = 'gast';
  public classname: string = "unchanged"
  public classtoggle: boolean = false

  constructor(private userService: UserService, private marketDataService: MarketDataService) { }

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
    this.userService.getUserData().subscribe({
      next: (data: UserData) => {
        this.username = data.username;
      },
      error: (err) => {
        console.error('Fout bij ophalen gebruikersnaam:', err);
        this.username = 'gebruiker (fout)';
      }
    });
  }
}