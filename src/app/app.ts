import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './task-list/task-list';
@Component({
  selector: 'app-root',
  imports:[TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'reactive-task-dashboard';
}
