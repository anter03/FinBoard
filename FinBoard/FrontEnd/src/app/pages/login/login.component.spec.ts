import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('remember')?.value).toBe(false);
  });

  it('should display finBoard as logo', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo'));
    expect(logoElement.nativeElement.textContent.trim()).toBe('finBoard');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const emailControl = component.loginForm.get('email');
    
    // Test required validation
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.hasError('email', 'required')).toBeTruthy();
    
    // Test email format validation
    emailControl?.setValue('invalid-email');
    expect(component.hasError('email', 'email')).toBeTruthy();
    
    // Test valid email
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const passwordControl = component.loginForm.get('password');
    
    // Test required validation
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.hasError('password', 'required')).toBeTruthy();
    
    // Test minlength validation
    passwordControl?.setValue('123');
    expect(component.hasError('password', 'minlength')).toBeTruthy();
    
    // Test valid password
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should display error messages when form fields are invalid', async () => {
    // Make form fields touched and invalid
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('email')?.markAsTouched();
    component.loginForm.get('password')?.setValue('123');
    component.loginForm.get('password')?.markAsTouched();
    
    fixture.detectChanges();
    await fixture.whenStable();
    
    const errorMessages = fixture.debugElement.queryAll(By.css('.error-text'));
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it('should call onSubmit when form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form'));
    
    form.nativeElement.dispatchEvent(new Event('submit'));
    
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should navigate to dashboard on successful login', (done) => {
    // Set valid form values
    component.loginForm.patchValue({
      email: 'admin@finboard.com',
      password: 'password'
    });
    
    component.onSubmit();
    
    // Wait for setTimeout in onSubmit
    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    }, 1600);
  });

  it('should show error message on invalid login', (done) => {
    component.loginForm.patchValue({
      email: 'wrong@email.com',
      password: 'wrongpassword'
    });
    
    component.onSubmit();
    
    setTimeout(() => {
      expect(component.errorMessage).toBe('Credenziali non valide. Riprova.');
      done();
    }, 1600);
  });

  it('should disable submit button when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const submitButton = fixture.debugElement.query(By.css('.login-btn'));
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('should call onForgotPassword when forgot password link is clicked', () => {
    spyOn(component, 'onForgotPassword');
    const forgotPasswordLink = fixture.debugElement.query(By.css('.forgot-password'));
    
    forgotPasswordLink.nativeElement.click();
    
    expect(component.onForgotPassword).toHaveBeenCalled();
  });

  it('should call onRegister when register link is clicked', () => {
    spyOn(component, 'onRegister');
    const registerLink = fixture.debugElement.query(By.css('.link-button'));
    
    registerLink.nativeElement.click();
    
    expect(component.onRegister).toHaveBeenCalled();
  });

  it('should store user data in localStorage on successful login', (done) => {
    spyOn(localStorage, 'setItem');
    
    component.loginForm.patchValue({
      email: 'admin@finboard.com',
      password: 'password'
    });
    
    component.onSubmit();
    
    setTimeout(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('finboard_token', 'mock_jwt_token');
      expect(localStorage.setItem).toHaveBeenCalledWith('finboard_user', jasmine.any(String));
      done();
    }, 1600);
  });

  it('should have proper accessibility attributes', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));
    const passwordInput = fixture.debugElement.query(By.css('#password'));
    
    expect(emailInput.nativeElement.getAttribute('autocomplete')).toBe('email');
    expect(passwordInput.nativeElement.getAttribute('autocomplete')).toBe('current-password');
  });
});