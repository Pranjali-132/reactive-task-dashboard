import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
   standalone: true,
})
export class TaskList {

  tasks = [
  { id: 1, title: 'Design UI', description: 'Create layout', status: 'Pending' },
  { id: 2, title: 'API Integration', description: 'Connect backend', status: 'In Progress' },
  { id: 3, title: 'Testing', description: 'Test app', status: 'Completed' }
];
getStatusClass(status: string) {
  return status.toLowerCase().replace(' ', '-');
}

}
