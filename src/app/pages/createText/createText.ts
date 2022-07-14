
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { newTextCommunicationService } from "../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../services/timelineCommunicationService";

@Component({
  selector: "CreateText",
  templateUrl: "createText.html"
})
export class createTextComponent {
  newtextSchema: FormGroup;
  constructor(private fb: FormBuilder, private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService) {
    this.newtextSchema = fb.group({
      title: ["", Validators.required],
      text: ["", Validators.required],
    });
  }

  addNewText() {
    if (this.newtextSchema.valid) {
      this.newTextCommunicationService.addPNewText(this.newtextSchema.value.title, this.newtextSchema.value.text).subscribe((res) => {
         console.log("Added new text")
      });
    }
  }

}
