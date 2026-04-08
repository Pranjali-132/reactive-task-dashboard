import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true
})
export class Login {

  username:string=''

  constructor(private router:Router){}

    ngOnInit(){
      const user = localStorage.getItem('user');

      if (user) {
        this.router.navigate(['/dashboard']);
      }
    }
    
login() {
  if (!this.username.trim()) return;

  localStorage.setItem('user', this.username);
  this.router.navigate(['/dashboard']);
}
}
