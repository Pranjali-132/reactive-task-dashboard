import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {

transform(tasks: any[],searchText: string,selectedStatus: string,selectedPriority: string): any[] {

  if (!tasks) return [];

  return tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchText?.toLowerCase() || '');

    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;

    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}

}
