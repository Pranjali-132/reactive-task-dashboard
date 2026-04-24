import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user';
import { ToastService } from '../services/toast-service';
import { TeamService } from '../services/team';
import { SpinnerService } from '../services/spinner-service';
interface User {
  uid: string;
  name: string;
  username: string;
  role: string;
  teamId: string;
  email: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  activeTab: string = 'login';
  currentUser: any = null;
    // AUTH FIELDS
  loginEmail = '';
  loginPassword = '';
  registerEmail = '';
  registerPassword = '';

  // REGISTER FIELDS
  name: string = '';
  username: string = '';
  teamName: string = '';
  teamId: string = '';

  teams: any[] = [];
  filteredTeams: any[] = [];
  showDropdown: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private teamService: TeamService,
    private spinner: SpinnerService
  ) {}

  ngOnInit() {
  const user = localStorage.getItem('user');

  if (user) {
    this.router.navigate(['/dashboard']);
  }

  this.teamService.getTeams().subscribe(data => {
    this.teams = data;
  });
}

  async login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.toastService.show('Enter email & password', 'error');
      return;
    }
    this.spinner.show();
    try {
      const userData = await this.userService.loginUser(this.loginEmail, this.loginPassword) as User;

      localStorage.setItem('user', JSON.stringify(userData));

      this.toastService.show('Login successful', 'success');

      if (userData.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }

    } catch (err: any) {
      this.toastService.show(err.message, 'error');
    }
    finally{
      this.spinner.hide();
    };
  }


  async register() {

    if (!this.name.trim() || !this.registerEmail.trim() || !this.registerPassword.trim()) {
      this.toastService.show('Fill all required fields', 'error');
      return;
    }

    const normalize = (val: string) => val.trim().toLowerCase();

    let teamIdToUse = this.teamId;

    if (!teamIdToUse) {
      const selectedTeam = this.teams.find(
        t => normalize(t.name) === normalize(this.teamName)
      );

      if (selectedTeam) {
        teamIdToUse = selectedTeam.id;
      } else {
        const newTeam = await this.teamService.addTeam({
          name: this.teamName.trim()
        });
        teamIdToUse = newTeam.id;
      }
    }

    if (!this.teamName.trim()) {
      this.toastService.show('Please select or enter team', 'error');
      return;
    }
    this.spinner.show();
    try {
      await this.userService.registerUser({
        name: this.name.trim(),
        email: this.registerEmail.trim().toLowerCase(),
        username: this.username.trim().toLowerCase(),
        password:this.registerPassword,
        role: 'employee',  
        teamId: teamIdToUse
      });

      this.toastService.show('Registration successful', 'success');

      this.name = '';
      this.registerEmail = '';
      this.registerPassword = '';
      this.username = '';

      this.activeTab = 'login';

    } catch (err: any) {
      this.toastService.show(err.message, 'error');
    }
    finally{
      this.spinner.hide();
    };
  }

  selectTeam(team: any) {
    this.teamName = team.name;
    this.teamId = team.id;
    this.showDropdown = false;
  }

  filterTeams() {
    const search = this.teamName.toLowerCase();

    this.filteredTeams = this.teams.filter(team =>
      team.name.toLowerCase().includes(search)
    );

    this.teamId = '';
  }
}
