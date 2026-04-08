import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks } from '../services/task';
  interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule 
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
  currentUser: string = '';

  constructor(private router: Router, private taskService:Tasks){}

ngOnInit(): void {
  this.currentUser = localStorage.getItem('user') || '';

  console.log('CURRENT USER:', this.currentUser);

  this.taskService.getTasks(this.currentUser).subscribe(data => {
    console.log('FILTERED DATA:', data);
    this.tasks = data;
  });
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

getFilteredTasks() {
  return this.tasks.filter(task => {

    const matchesSearch = task.title
      .toLowerCase()
      .includes(this.searchText.toLowerCase());

    const matchesStatus =
      this.selectedStatus === 'All' ||
      task.status === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

addTask() {
  console.log('ADD CLICKED');

  // ✅ prevent empty title
  if (!this.newTask.title.trim()) {
    console.log('EMPTY TITLE BLOCKED');
    return;
  }

  // ✅ prevent adding task without user
  if (!this.currentUser) {
    console.error('NO USER FOUND - TASK NOT ADDED');
    return;
  }

  const task = {
    title: this.newTask.title.trim(),
    description: this.newTask.description.trim(),
    status: this.newTask.status,
    user: this.currentUser
  };

  this.taskService.addTask(task)
    .then(() => {
      console.log('TASK ADDED SUCCESS');
    })
    .catch(err => {
      console.error('ERROR ADDING TASK:', err);
    });

  // ✅ reset form
  this.newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };
}

deleteTask(id: string) {
  this.taskService.deleteTask(id);
}

editTask(id: string) {
  this.editingTaskId = id;
}

saveTask(task: any) {
  this.taskService.updateTask(task.id, task);
  this.editingTaskId = null;
}

logout() {
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}
}
