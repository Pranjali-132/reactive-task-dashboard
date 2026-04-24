import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/toast/toast";
import { Spinner } from "./shared/spinner/spinner";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone:true
})
export class App {

}
