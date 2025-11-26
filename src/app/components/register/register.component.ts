import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { UserRegisterDTO } from '../../DTOs/UserDTOs';
import { validateEquivalent } from '../../validators/equivalent.validator';

@Component({
  selector: 'app-register',
  imports: [RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  userService = inject(UserService);
  router = inject(Router);
  registerStatus = signal<string>('');
  isRegistered = false;

  private readonly fb = inject(FormBuilder);
  protected readonly usernameCtrl = this.fb.control(
    '',
    [Validators.required, Validators.minLength(7), Validators.maxLength(25)],
    [this.userService.validateUsername()]
  );
  protected readonly firstNameCtrl = this.fb.control('', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  protected readonly lastNameCtrl = this.fb.control('', [
    Validators.required,
    Validators.maxLength(50),
  ]);
  protected readonly emailCtrl = this.fb.control('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(255),
  ]);
  protected readonly passwordCtrl = this.fb.control('', [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(25),
  ]);
  protected readonly passwordRepeatCtrl = this.fb.control('', [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(25),
  ]);
  protected readonly registerForm = this.fb.group(
    {
      username: this.usernameCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl,
      passwordRepeat: this.passwordRepeatCtrl,
    },
    { validators: [validateEquivalent('password', 'passwordRepeat')] }
  );

  register(): void {
    console.log('register called');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerStatus.set('Connecting...');

    const userDTO: UserRegisterDTO = {
      Username: this.usernameCtrl.value!.toString(),
      FirstName: this.firstNameCtrl.value!.toString(),
      LastName: this.lastNameCtrl.value!.toString(),
      Email: this.emailCtrl.value!.toString(),
      Password: this.passwordCtrl.value!.toString(),
    };

    if (environment.mockApi) {
      console.log('mock register attempt', { userDTO });
      // UserService also handles mock login logic
    }

    this.userService.registerNewUser(userDTO).subscribe({
      next: () => {
        console.log('registering succeeded');
        this.registerStatus.set('');
        this.isRegistered = true;
      },
      error: (err: any) => {
        console.error('registering failed', err);
        this.registerStatus.set('Registering failed.');
      },
    });
  }
}
