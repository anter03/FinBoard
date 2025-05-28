import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
     debugger;
    if (this.email === 'admin@example.com' && this.password === 'admin') {
      alert('Login riuscito!');
      // Puoi navigare ad un'altra pagina se hai un router
    } else {
      alert('Credenziali non valide');
    }
  }
}
