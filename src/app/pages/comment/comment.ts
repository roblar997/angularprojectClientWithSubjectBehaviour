
import { emitDistinctChangesOnlyDefaultValue } from "@angular/compiler";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { tidslinje } from "../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../models/tidslinjeCommandWrapper";
import { title } from "../../models/title";
import { newTextCommunicationService } from "../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../services/timelineCommunicationService";

@Component({
  selector: "Comment",
  templateUrl: "comment.html"
})
export class commentComponent  implements OnInit {
  cdf: ChangeDetectorRef;
  constructor(private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService, cdf: ChangeDetectorRef) { this.cdf = cdf; }

  ngOnInit(): void {
    this.newTextCommunicationService.getTitlesFromServer().subscribe((res) => {

      //Because components subscribes on this, it will trigger
      //onchange in child components
      this.titleList = res;

    });
   
  } 

  selectStart: Number = new Number();
  selectEnd: Number = new Number();
  selectedText: String = new String();
  commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array < tidslinjeCommandWrapper >()

  tidslinjerList: Array<tidslinje> = new Array<tidslinje>()
  filteredtimelines: Observable<Array<tidslinje>> = new Observable<Array<tidslinje>>()

  titleList: Array<String> = new Array<String>()
  currentTitle: title = new title();


  

  async titleChange1(title: title) {
    this.currentTitle = title;
    console.log("Parent detected that child 1 changed title to " + JSON.stringify(this.currentTitle))

    this.timelineCommunicationService.getInitPState(this.currentTitle.id).subscribe((res) => {
      this.tidslinjerList = res;
    
    });
  }
}
