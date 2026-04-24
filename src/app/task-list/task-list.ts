import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks } from '../services/task';
import { ToastService } from '../services/toast-service';
import { TaskFilterPipe } from '../pipes/task-filter.pipe.ts-pipe';
import { UserService } from '../services/user';
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority:string;
  assignedTo: string;        
  assignedToName?: string;   
  teamId: string;
  createdBy: string;       
  createdAt?: any;      
  updatedAt?: any;
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
  selectedPriority: string = 'All';
  newTask = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'low',  
    dueDate: ''           
  };
  editTaskCopy: any = null;
  editingTaskId: string | null = null;
  currentUser: any = null;
  today: Date = new Date();
  currentPage: number = 1;
  itemsPerPage: number = 3;

  constructor(private router: Router, private taskService:Tasks, private toastService: ToastService, private userService: UserService){}

ngOnInit(): void {

  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    this.router.navigate(['/login']);
    return;
  }

  const localUser = JSON.parse(storedUser);
  this.currentUser = localUser;

  this.userService.getUserById(localUser.uid)
    .then(freshUser => {

      if (freshUser) {
        this.currentUser = freshUser;
        localStorage.setItem('user', JSON.stringify(freshUser));
      }

      this.taskService.getTasks(this.currentUser)
        .subscribe(data => {
          this.tasks = data;
        });

    })
    .catch(err => {
      console.error(err);
      this.router.navigate(['/login']);
    });
}


getUserName(): string {
  return this.currentUser?.name || '';
}

addTask() {

  // prevent empty title
  if (!this.newTask.title.trim()) {
    this.toastService.show('Please enter a Title','error');
    return;
  }

  // prevent adding task without user
  if(!this.currentUser?.uid) {
    this.toastService.show('no user found-task not added','error');
    return;
  }

  const task = {
    title: this.newTask.title.trim(),
    description: this.newTask.description.trim(),
    status: this.newTask.status,
    priority: this.newTask.priority, 
    dueDate: this.newTask.dueDate || null,
    assignedTo: this.currentUser.uid,
    assignedToName: this.currentUser.username,
    teamId: this.currentUser.teamId,
    createdBy: this.currentUser.uid
  };

  this.taskService.addTask(task, this.currentUser)
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
    status: 'Pending',
    priority: 'low',
    dueDate: ''
  };

}

deleteTask(id: string) {
  this.taskService.deleteTask(id);
  this.toastService.show('Task is successfully deleted', 'info');
}

editTask(taskId: string) {

  const task = this.tasks.find(t => t.id === taskId);
  if (!task) return;

  this.editingTaskId = taskId;

  this.editTaskCopy = { ...task };
}


saveTask() {

  const updated = {
    ...this.editTaskCopy,
    updatedAt: new Date()
  };

  this.taskService.updateTask(this.editingTaskId!, updated);

  // update local UI
  const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
  if (index !== -1) {
    this.tasks[index] = { ...this.tasks[index], ...updated };
  }

  this.editingTaskId = null;
  this.editTaskCopy = null;
}

logout() {
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}

isAdmin(): boolean {
  return this.currentUser?.role === 'admin';
}

canModify(task: any): boolean {
  return task.assignedTo === this.currentUser.uid;
}

isOverdue(task: any): boolean {
  if (!task.dueDate || task.status === 'Completed') return false;

  const due = new Date(task.dueDate + 'T00:00:00').getTime();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return due < today.getTime();
}

cancelEdit() {
  this.editingTaskId = null;
  this.editTaskCopy = null;
}

getAdminTasks(): any[] {
  return this.tasks?.filter(task => !this.canModify(task)) || [];
}

getEmployeeTasks(): any[] {
  return this.tasks?.filter(task => this.canModify(task)) || [];
}

get filteredTasks() {
  return this.tasks.filter(task => {
    const matchStatus =
      this.selectedStatus === 'All' || task.status === this.selectedStatus;

    const matchPriority =
      this.selectedPriority === 'All' || task.priority === this.selectedPriority;

    const matchSearch =
      task.title.toLowerCase().includes(this.searchText.toLowerCase());

    return matchStatus && matchPriority && matchSearch;
  });
}

get totalPages(): number {
  return Math.ceil(this.filteredTasks.length / this.itemsPerPage);
}

get paginatedTasks() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredTasks.slice(start, start + this.itemsPerPage);
}

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
}

resetPage() {
  this.currentPage = 1;
}

}
