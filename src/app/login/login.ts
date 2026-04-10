import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user'

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login implements OnInit {
  activeTab: string = 'login';
  username: string = '';
  name: string = '';

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Login existing user
async login() {
  const normalizedUsername = this.username.trim().toLowerCase();

  if (!normalizedUsername) return;

  try {
    const userData = await this.userService.loginUser(normalizedUsername);

    localStorage.setItem('user', normalizedUsername);
    localStorage.setItem('name', (userData as any).name);

    alert('Login successful');
    this.router.navigate(['/dashboard']);
  } catch (error: any) {
    alert(error.message);
  }
}

  // Register new user
  async register() {
    if (!this.name.trim() || !this.username.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      await this.userService.registerUser({
        name: this.name.trim(),
        username: this.username.trim().toLowerCase()
      });

      alert('Registration successful. Please login.');

      // clear fields
      this.name = '';
      this.username = '';

      // switch to login tab
      this.activeTab = 'login';

    } catch (error: any) {
      alert(error.message);
    }
  }
}
