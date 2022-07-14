import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { commentlistComponent } from './components/commentList/commentlist';
import { commentSchemaComponent } from './components/commentSchema/commentSchema';
import { commentSearchInfoComponent } from './components/commentSearchInfo/commentSearchInfo';
import { titleSearchComponent } from './components/titleSearch/titleSearch';
import { CommonModule } from '@angular/common';
import { commentComponent } from './comment';
import { newTextCommunicationService } from '../../services/newTextCommunicationService';
import { timelineCommunicationService } from '../../services/timelineCommunicationService';
import { textDataStorageService } from './localServices/textDataStorageService';
import { timelineDataStorageService } from './localServices/timelineDataStorageService';

@NgModule({
  declarations: [commentlistComponent,
    commentSchemaComponent,
    commentSearchInfoComponent,
    titleSearchComponent, commentComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [textDataStorageService, timelineDataStorageService],
})
export class CommentModule { }
