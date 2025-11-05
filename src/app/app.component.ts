import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WelcomeComponent } from "./welcome/welcome.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WelcomeComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VirtualWalletFrontend';
}
