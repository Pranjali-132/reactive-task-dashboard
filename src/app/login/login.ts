import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user'
import { ToastService } from '../services/toast-service';

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
    private userService: UserService,
    private toastService: ToastService
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

    this.toastService.show('Login successful', 'success');
    this.router.navigate(['/dashboard']);
  } catch (error: any) {
    this.toastService.show(error.message);
  }
}

  // Register new user
  async register() {
    if (!this.name.trim() || !this.username.trim()) {
      this.toastService.show('Please fill all fields');
      return;
    }

    try {
      await this.userService.registerUser({
        name: this.name.trim(),
        username: this.username.trim().toLowerCase()
      });

      this.toastService.show('Registration successful. Please login.');

      // clear fields
      this.name = '';
      this.username = '';

      // switch to login tab
      this.activeTab = 'login';

    } catch (error: any) {
      this.toastService.show(error.message);
    }
  }
}
