
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-logout',
  imports: [RouterModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
  standalone: true,
})
export class LogoutComponent implements OnInit {

 constructor(private router: Router) {}

 ngOnInit(): void {
    sessionStorage.clear(); 
    //TODO:
    //this.authService.logout(credentials)
    this.router.navigate(['/login']); 
 }
}
