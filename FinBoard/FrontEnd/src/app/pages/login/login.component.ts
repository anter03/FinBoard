import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';

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
  credentials: LoginRequest = { username: '', password: '' };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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

  //onSubmit(): void {
  //   this.router.navigate(['/dashboard']);
  //onSubmit(): void {
onSubmit(): void {
   // if (this.loginForm.valid) {
  if (true) {
    const credentials: LoginRequest = {
      username: this.email?.value,  // o email se cambi l'interface
      password: this.password?.value  
    };
    
    console.log('Sending credentials:', credentials);
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login fallito', err);
        this.errorMessage = 'Login fallito. Verifica le credenziali.';
      }
    });
  }
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