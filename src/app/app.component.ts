import { Component } from '@angular/core';
import { newTextCommunicationService } from './services/newTextCommunicationService';
import { timelineCommunicationService } from './services/timelineCommunicationService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularprojectClientBehaviourSubj';
  constructor(private _newTextCommunicationService: newTextCommunicationService,
    private _timelineCommunicationService: timelineCommunicationService ) { }
}
