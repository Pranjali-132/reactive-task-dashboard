import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  tasks:any[] = [];
  searchText: string = '';
  selectedStatus: string = 'All';
  newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };

  ngOnInit(): void {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }   
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
  const task = {
    id: Date.now(),
    title: this.newTask.title,
    description: this.newTask.description,
    status: this.newTask.status
  };

  this.tasks.push(task);
  //saving to localStorage
  localStorage.setItem('tasks',JSON.stringify(this.tasks))

  // reset form
  this.newTask = {
    title: '',
    description: '',
    status: 'Pending'
  };
}

}
