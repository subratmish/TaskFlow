import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  error = signal<string>('');
  isLoading = signal(false);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.error.set('');
      this.isLoading.set(true);

      const { username, password } = this.form.value;
      
      // Simulate a small network delay for better UX feel
      setTimeout(() => {
        const success = this.authService.login(username!, password!);
        
        if (!success) {
          this.error.set('Invalid username or password');
          this.isLoading.set(false);
        }
        // If success, the app component will automatically switch views based on the signal
      }, 600);
    }
  }
}