import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks } from '../services/task';
import { ToastService } from '../services/toast-service';
import { TaskFilterPipe } from '../pipes/task-filter.pipe.ts-pipe';
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  user: string;
  teamId: string;
  createdBy: string;
}
@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    TaskFilterPipe
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  standalone: true,
})
export class TaskList implements OnInit{

  tasks:Task[] = [];
  searchText: string = '';
  selectedStatus: string = 'All';
  newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };
  editingTaskId: string | null = null;
  currentUser: any = null;

  constructor(private router: Router, private taskService:Tasks, private toastService: ToastService){}

ngOnInit(): void {
  this.currentUser = JSON.parse(localStorage.getItem('user')!);

  this.taskService.getTasks(this.currentUser).subscribe(data => {
    this.tasks = data;
  });
}

getUserName(): string {
  return this.currentUser?.name || '';
}

getStatusClass(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

getTotalTasks() {
  return this.tasks.length;
}

getCompletedTasks() {
  return this.tasks.filter(t => t.status === 'Completed').length;
}

getPendingTasks() {
  return this.tasks.filter(t => t.status === 'Pending').length;
}

getInProgressTasks() {
  return this.tasks.filter(t => t.status === 'In Progress').length;
}

addTask() {

  // prevent empty title
  if (!this.newTask.title.trim()) {
    this.toastService.show('Please enter a Title','error');
    return;
  }

  // prevent adding task without user
  if(!this.currentUser?.username) {
    this.toastService.show('no user found-task not added','error');
    return;
  }

  const task = {
    title: this.newTask.title.trim(),
    description: this.newTask.description.trim(),
    status: this.newTask.status,
    user: this.currentUser.username,
    teamId: this.currentUser.teamId,
    createdBy: this.currentUser.username
  };

  this.taskService.addTask(task)
    .then(() => {
      this.toastService.show('Task added successfully', 'success');
    })
    .catch(err => {
      this.toastService.show('ERROR ADDING TASK:', err);
    });

  // reset form
  this.newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };
}

deleteTask(id: string) {
  this.taskService.deleteTask(id);
  this.toastService.show('Task is successfully deleted', 'info');
}

editTask(id: string) {
  this.editingTaskId = id;
}

saveTask(task: any) {
  const { id, ...taskData } = task; //remove id
  this.taskService.updateTask(id, taskData);
  this.editingTaskId = null;
}

logout() {
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}

isAdmin(): boolean {
  return this.currentUser?.role === 'admin';
}

}
