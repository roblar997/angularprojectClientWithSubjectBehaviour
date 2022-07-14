import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tidslinje } from '../../../models/tidslinje';
import { tidslinjeChangeForm } from '../../../models/tidslinjeChangeForm';

@Component({
  templateUrl: 'changeCommentModal.html'
})
export class changeCommentModal {

  changeSchema: FormGroup;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.changeSchema = fb.group({
      user: ["", Validators.required],
      text: ["", Validators.required],
      likedislikeother: ["", Validators.required]
    });
  }

  @Input() public tidslinjechange: tidslinjeChangeForm = new tidslinjeChangeForm(undefined, undefined, undefined);
  @Output() componentResult: EventEmitter<tidslinjeChangeForm> = new EventEmitter();

  async resultChange() {
    if (this.changeSchema.valid) {
      console.log("Modal is detecting form is changed, and validated, to" + JSON.stringify(this.tidslinjechange));
      this.componentResult.emit(this.tidslinjechange);
    }
    else {
      console.log("Modal detected form is change, but it is marked as invalid")
    }
   
    
  }
}
