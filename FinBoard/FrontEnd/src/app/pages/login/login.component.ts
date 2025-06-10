import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
      this.router.navigate(['/dashboard']);
  }



  // Getter per accesso facile ai controlli del form
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // Metodi per validazione
  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  onForgotPassword(): void {
    // Implementare logica per password dimenticata
    console.log('Forgot password clicked');
    // this.router.navigate(['/forgot-password']);
  }

  onRegister(): void {
    // Implementare navigazione a registrazione
    console.log('Register clicked');
    // this.router.navigate(['/register']);
  }
}