import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: Toast[] = [];

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast: Toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => this.remove(toast), 3000);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
