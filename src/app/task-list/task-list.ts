import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks } from '../services/task';
import { ToastService } from '../services/toast-service';
import { UserService } from '../services/user';
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  assignedToName?: string;
  assignedBy?: string;        
  assignedByName?: string;   
  teamId: string;
  createdBy: string;
  createdByName?: string;
  dueDate?: string;          
  createdAt?: any;
  updatedAt?: any;
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
  selectedPriority: string = 'All';
  selectedUser: string = '';
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
  // MY TASKS PAGINATION
  myCurrentPage = 1;
  myItemsPerPage = 4;
  // TEAM TASKS PAGINATION
  teamCurrentPage = 1;
  teamItemsPerPage = 4;
  teamMembers: any[] = [];
  selectedAssigneeId: string = '';
  editingTeamTaskId: string | null = null;
  editTeamTaskCopy: any = null;
  originalAssignedTo: string | null = null;
  isTeamEditModalOpen: boolean = false;
  isMyTaskEditModalOpen:boolean = false;
  expandedTaskIds: Set<string> = new Set();

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

    if (this.currentUser.role === 'admin') {
     this.userService.getTeamMembers(this.currentUser.teamId)
      .subscribe(users => {
        this.teamMembers = users;
        this.selectedAssigneeId = this.currentUser.uid;
      });
  }
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

  //prevent empty date field
  if (!this.newTask.dueDate) {
    this.toastService.show('Please select a due date','error');
    return;
  }

  // prevent adding task without user
  if(!this.currentUser?.uid) {
    this.toastService.show('no user found-task not added','error');
    return;
  }

    const assignedUser = this.teamMembers.find(
    u => u.uid === this.selectedAssigneeId
    ) || this.currentUser;

  const task = {
    title: this.newTask.title.trim(),
    description: this.newTask.description.trim(),
    status: this.newTask.status,
    priority: this.newTask.priority,
    dueDate: this.newTask.dueDate || null,
    assignedTo: assignedUser.uid,
    assignedToName: assignedUser.username,
    createdBy: this.currentUser.uid,
    createdByName: this.currentUser.username,
    teamId: this.currentUser.teamId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  this.taskService.addTask(task, this.currentUser)
    .then(() => {
      this.toastService.show('Task added successfully', 'success');
    })
    .catch(err => {
      this.toastService.show('Error adding task', 'error');
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
  this.taskService.deleteTask(id)
    .then(() => {
      this.toastService.show('Task is successfully deleted', 'info');
    })
    .catch(() => {
      this.toastService.show('Error deleting task', 'error');
    });
}

editTask(taskId: string) {
  const task = this.tasks.find(t => t.id === taskId);
  if (!task) return;

  this.editingTaskId = taskId;
  this.editTaskCopy = JSON.parse(JSON.stringify(task));
  this.isMyTaskEditModalOpen=true;
}

saveTask() {
  const title = this.editTaskCopy?.title?.trim();
  if (!title) {
    this.toastService.show('Title cannot be empty', 'error');
    return;
  }

  const dueDate = this.editTaskCopy?.dueDate;
  if (!dueDate) {
    this.toastService.show('Due date cannot be empty', 'error');
    return;
  }

  if (isNaN(Date.parse(dueDate))) {
    this.toastService.show('Invalid due date', 'error');
    return;
  }

  const originalTask = this.tasks.find(t => t.id === this.editingTaskId);
  // reassignment ONLY for admin
  if (this.isAdmin()) {
    const selectedUser = this.teamMembers.find(
      u => u.uid === this.editTaskCopy.assignedTo
    );
    if (selectedUser) {
      this.editTaskCopy.assignedToName = selectedUser.username;
    }
    // Update assignedBy ONLY if reassignment happened
    if (originalTask && originalTask.assignedTo !== this.editTaskCopy.assignedTo) {
      this.editTaskCopy.assignedBy = this.currentUser.uid;
      this.editTaskCopy.assignedByName = this.currentUser.username;
    }
  }

  const updated = {
    ...this.editTaskCopy,
    updatedAt: new Date()
  };

  this.taskService.updateTask(this.editingTaskId!, updated)
    .then(() => {
      this.toastService.show('Task updated successfully', 'success');
      const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          ...updated
        };
      }
      this.editingTaskId = null;
      this.editTaskCopy = null;
      this.isMyTaskEditModalOpen=false;
    })
    .catch(() => {
      this.toastService.show('Failed to update task. Please try again.', 'error');
    });
}

cancelEdit() {
  this.editingTaskId = null;
  this.editTaskCopy = null;
  this.isMyTaskEditModalOpen=false;
}

logout() {
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
  this.toastService.show('You have been logged out successfully.', 'success');
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

getOverdueText(task: any): string {

  if (!task.dueDate || task.status === 'Completed') return '';

  const due = new Date(task.dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 0) return '';

  const days = Math.floor(diffDays);
  return days === 1 ? '1 day overdue' : `${days} days overdue`;
}

get teamMembersForFilter() {
  return this.teamMembers.filter(u => u.role !== 'admin');
}

//reusable filter method
applyFilters(tasks: Task[]): Task[] {
  return tasks.filter(task => {

    const matchSearch =
      task.title?.toLowerCase().includes(this.searchText?.toLowerCase() || '');

    const matchStatus =
      this.selectedStatus === 'All' || task.status === this.selectedStatus;

    const matchPriority =
      this.selectedPriority === 'All' || task.priority === this.selectedPriority;

    const matchUser =
      !this.selectedUser || task.assignedTo === this.selectedUser;

    return matchSearch && matchStatus && matchPriority && matchUser;
  });
}

get myTasks() {
  return this.tasks.filter(t => t.assignedTo === this.currentUser.uid);
}

get filteredMyTasks() {
  return this.applyFilters(this.myTasks);
}

get myTotalPages() {
  return Math.ceil(this.filteredMyTasks.length / this.myItemsPerPage);
}

get paginatedMyTasks() {
  const start = (this.myCurrentPage - 1) * this.myItemsPerPage;
  return this.filteredMyTasks.slice(start, start + this.myItemsPerPage);
}

get teamTasks() {
  return this.tasks.filter(t => t.assignedTo !== this.currentUser.uid);
}

get filteredTeamTasks() {
  return this.applyFilters(this.teamTasks);
}

get teamTotalPages() {
  return Math.ceil(this.filteredTeamTasks.length / this.teamItemsPerPage);
}

get paginatedTeamTasks() {
  const start = (this.teamCurrentPage - 1) * this.teamItemsPerPage;
  return this.filteredTeamTasks.slice(start, start + this.teamItemsPerPage);
}

goToMyPage(page: number) {
  if (page < 1 || page > this.myTotalPages) return;
  this.myCurrentPage = page;
}

goToTeamPage(page: number) {
  if (page < 1 || page > this.teamTotalPages) return;
  this.teamCurrentPage = page;
}

resetPagination() {
  this.myCurrentPage = 1;
  this.teamCurrentPage = 1;
}

formatDate(value: any): Date | null {
  if (!value) return null;

  // Firestore timestamp
  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  // Firestore Timestamp object
  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  // String or ISO
  const date = new Date(value);

  return isNaN(date.getTime()) ? null : date;
}

editTeamTask(taskId: string) {
  const task = this.tasks.find(t => t.id === taskId);
  if (!task) return;

  this.editingTeamTaskId = taskId;
  this.editTeamTaskCopy = { ...task };

  this.originalAssignedTo = task.assignedTo;
  this.isTeamEditModalOpen = true;
}

saveTeamTask() {
  if (this.originalAssignedTo !== this.editTeamTaskCopy.assignedTo) {
    const selectedUser = this.teamMembers.find(
      u => u.uid === this.editTeamTaskCopy.assignedTo
    );
    this.editTeamTaskCopy.assignedBy = this.currentUser.uid;
    this.editTeamTaskCopy.assignedByName = this.currentUser.username;
    this.editTeamTaskCopy.assignedToName = selectedUser?.username || '';
  }

  const updated = {
    ...this.editTeamTaskCopy,
    updatedAt: new Date()
  };

  this.taskService.updateTask(this.editingTeamTaskId!, updated)
    .then(() => {
      this.toastService.show('Team task updated successfully', 'success');

      this.editingTeamTaskId = null;
      this.editTeamTaskCopy = null;
      this.originalAssignedTo = null;
      this.isTeamEditModalOpen = false;
    })
    .catch(() => {
      this.toastService.show('Failed to update task', 'error');
    });
}

  cancelEditforTeamTasks(){
      this.editingTaskId = null;
      this.editTaskCopy = null;
      this.editingTeamTaskId = null;
      this.editTeamTaskCopy = null;
      this.originalAssignedTo = null;
      this.isTeamEditModalOpen = false;
  }

  toggleExpand(taskId: string) {
    if (this.expandedTaskIds.has(taskId)) {
      this.expandedTaskIds.delete(taskId);
    } else {
      this.expandedTaskIds.add(taskId);
    }
  }

  isExpanded(taskId: string): boolean {
    return this.expandedTaskIds.has(taskId);
  }


}
