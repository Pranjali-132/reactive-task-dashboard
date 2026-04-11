import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user'
import { ToastService } from '../services/toast-service';
import { TeamService } from '../services/team';
interface User {
  name: string;
  username: string;
  role: string;
  teamId: string;
}
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
  role: string = 'employee';
  teams: any[] = [];
  teamName: string = '';
  filteredTeams: any[] = [];
  showDropdown: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private teamService:  TeamService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('user');

    if (user) {
      this.router.navigate(['/dashboard']);
    }
    this.teamService.getTeams().subscribe(data => {console.log('Teams:', data);this.teams = data;});
  }

  // Login existing user
async login() {
  const normalizedUsername = this.username.trim().toLowerCase();

  if (!normalizedUsername) return;

  try {
    const userData = await this.userService.loginUser(normalizedUsername) as User;

    //role validation
    if (userData.role !== this.role) {
      this.toastService.show(`You are not registered as ${this.role}`, 'error');
      return;
    }

    // store user
    localStorage.setItem('user', JSON.stringify(userData));

    this.toastService.show('Login successful', 'success');

    // role-based navigation
    if (userData.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }

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
    // find if team exists
    const normalize = (val: string) =>
    val.trim().toLowerCase();

    let selectedTeam = this.teams.find(
      t => normalize(t.name) === normalize(this.teamName)
    );

    let teamIdToUse: string;

    if (selectedTeam) {
      // existing team
      teamIdToUse = selectedTeam.id;
    } else {
      // create new team
      const newTeam = await this.teamService.addTeam({
        name: this.teamName.trim()
      });

      teamIdToUse = newTeam.id;
    }

    if (!this.teamName.trim()) {
      this.toastService.show('Please enter a team');
      return;
    }

    try {
      await this.userService.registerUser({
        name: this.name.trim(),
        username: this.username.trim().toLowerCase(),
        role: this.role,
        teamId: teamIdToUse
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
