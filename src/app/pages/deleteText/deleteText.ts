
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { newTextCommunicationService } from "../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../services/timelineCommunicationService";

@Component({
  selector: "DeleteText",
  templateUrl: "deleteText.html"
})
export class deleteTextComponent {

  titleList: Array<String> = new Array<String>();

  constructor(private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService) { }

  //ID's used in HTML
  @ViewChild("titleselectTitles") titleselectTitles!: ElementRef;

  ngOnInit(): void {
    this.newTextCommunicationService.getTitlesFromServer().subscribe((res) => {


      this.titleList = res;
    });

  }

  deleteText() {
    let titleAsText: String = this.titleselectTitles.nativeElement.value;

    this.newTextCommunicationService.deletePText(titleAsText).subscribe((res) => {
      console.log("Leaved delete title service")
    });

    console.log("Detecting a need to delete text with title " + titleAsText)
  }
  
}
