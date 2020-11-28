import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BasbrcWebUI';

  constructor(private authService: AuthenticationService){}

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event) {
    this.authService.logout();
  }
}
