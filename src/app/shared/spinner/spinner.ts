import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner-service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  standalone:true
})
export class Spinner {

  constructor(public spinnerService: SpinnerService) {}
}
