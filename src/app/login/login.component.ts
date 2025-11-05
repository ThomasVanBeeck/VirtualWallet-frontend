import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router)

    private readonly fb = inject(FormBuilder)
  protected readonly usernameCtrl = this.fb.control('', [Validators.required, Validators.minLength(7), Validators.maxLength(25)])
  protected readonly passwordCtrl = this.fb.control('', [Validators.required, Validators.minLength(12), Validators.maxLength(20)])
  protected readonly loginForm = this.fb.group({
    username: this.usernameCtrl,
    password: this.passwordCtrl
  })

login(): void {
  console.log("login called")
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const username = this.usernameCtrl.value!;
  const password = this.passwordCtrl.value!;

  if (environment.mockApi) {
    console.log("mock login attempt", { username, password });
    // AuthService already handles mock login logic
  }

  this.authService.login(username, password).subscribe({
    next: () => {
      console.log("login ok")
          this.router.navigate(['/app/welcome'])
    },
    error: err => console.error("login failed", err)
  });
}


}
