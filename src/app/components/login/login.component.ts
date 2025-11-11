import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { UserLoginDTO } from '../../DTOs/UserDTOs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router)
  loginStatus = signal<string>('')

  private readonly fb = inject(FormBuilder)
  protected readonly usernameCtrl = this.fb.control('', [Validators.required, Validators.minLength(7), Validators.maxLength(25)])
  protected readonly passwordCtrl = this.fb.control('', [Validators.required, Validators.minLength(12), Validators.maxLength(20)])
  protected readonly loginForm = this.fb.group({
    username: this.usernameCtrl,
    password: this.passwordCtrl
  })

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loginStatus.set("Connecting...")
    
    const userLoginDTO: UserLoginDTO = {
    username: this.usernameCtrl.value!.toString(),
    password: this.passwordCtrl.value!.toString()
    }

    if (environment.mockApi) {
      console.log("mock login attempt", { userLoginDTO });
    }

    this.authService.login(userLoginDTO).subscribe({
      next: () => {
        this.router.navigate(['/app/welcome'])
        this.loginStatus.set("")
      },
      error: err => {
        if (err.status == 401) this.loginStatus.set("Username and/or password incorrect.")
        else this.loginStatus.set("Login failed.");
        
      }
    });
  }
}
