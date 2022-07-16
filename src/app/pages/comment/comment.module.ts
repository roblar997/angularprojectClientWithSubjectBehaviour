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
import { timelineDataStorageService } from './localServices/timelineDataStorageService';
import { AppModule } from '../../app.module';
import { changeCommentModal } from './modal/changeCommentModal';

@NgModule({

  declarations: [commentlistComponent,
    commentSchemaComponent,
    commentComponent,
    commentSearchInfoComponent,
    titleSearchComponent],
  imports: [

    RouterModule.forChild([{ path: '', component: commentComponent, pathMatch: 'full' },
        { path: 'comment', component: commentComponent, pathMatch: 'full' }]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  exports: [RouterModule],
  providers: [{ provide: timelineDataStorageService, useValue: new timelineDataStorageService() }],
  entryComponents: [changeCommentModal]

})
export class CommentModule { }
