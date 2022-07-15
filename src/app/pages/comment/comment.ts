
import { emitDistinctChangesOnlyDefaultValue } from "@angular/compiler";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { tidslinje } from "../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../models/tidslinjeCommandWrapper";
import { title } from "../../models/title";
import { newTextCommunicationService } from "../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../services/timelineCommunicationService";
import { timelineDataStorageService } from "../comment/localServices/timelineDataStorageService";

@Component({
  selector: "Comment",
  templateUrl: "comment.html"
})
export class commentComponent  implements OnInit {
  cdf: ChangeDetectorRef;
  constructor(private newTextCommunicationService: newTextCommunicationService, private timelineDataStorageService: timelineDataStorageService,
    private timelineCommunicationService: timelineCommunicationService, cdf: ChangeDetectorRef) { this.cdf = cdf; }


  @Input('selectStart') selectStart: Number = new Number();
  @Input('selectEnd') selectEnd: Number = new Number();
  @Input('selectedText') selectedText: String = new String();
  @Input('commandTidslinjeWrapper') commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>()
  @Input('tidslinjerList') tidslinjerList: Array<tidslinje> = new Array<tidslinje>()
  @Input('filteredtimelines') filteredtimelines: Array<tidslinje> = Array<tidslinje>()
  @Input('titleList') titleList: Array<String> = new Array<String>()
  @Input('currentTitle') currentTitle: title = new title();

  //Subscriptions
  selectStartSubscription: Subscription | undefined;
  selectEndSubscription: Subscription | undefined;
  selectedTextSubscription: Subscription | undefined;
  commandTidslinjeWrapperSubscription: Subscription | undefined;
  tidslinjerListSubscription: Subscription | undefined;
  filteredtimelinesSubscription: Subscription | undefined;
  titleListSubscription: Subscription | undefined;
  currentTitleSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.selectStartSubscription = this.timelineDataStorageService.currentselectStart.subscribe(selectStart => this.selectStart = selectStart)
    this.selectEndSubscription = this.timelineDataStorageService.currentselectEnd.subscribe(selectEnd => this.selectEnd = selectEnd)
    this.selectedTextSubscription = this.timelineDataStorageService.currentselectedText.subscribe(selectedText => this.selectedText = selectedText)
    this.commandTidslinjeWrapperSubscription = this.timelineDataStorageService.currentcommandTidslinjeWrapper.subscribe(commandTidslinjeWrapper => this.commandTidslinjeWrapper = commandTidslinjeWrapper)
    this.tidslinjerListSubscription = this.timelineDataStorageService.currenttidslinjerList.subscribe(tidslinjerList => this.tidslinjerList = tidslinjerList)
    this.filteredtimelinesSubscription = this.timelineDataStorageService.currentfilteredtimelines.subscribe(filteredtimelines => this.filteredtimelines = filteredtimelines)
    this.titleListSubscription = this.timelineDataStorageService.currenttitleList.subscribe(titleList => this.titleList = titleList)
    this.currentTitleSubscription = this.timelineDataStorageService.currentTitle.subscribe(currentTitle => this.currentTitle = currentTitle)
    this.newTextCommunicationService.getTitlesFromServer().subscribe((res) => {

      //Because components subscribes on this, it will trigger
      //onchange in child components
      this.titleList = res;
      this.changetitleList();

    });
  }

  changetitleList() {
    this.timelineDataStorageService.changetitleList(this.titleList)
  }

  ngOnDestroy() {
    this.selectStartSubscription?.unsubscribe()
    this.selectEndSubscription?.unsubscribe()
    this.selectedTextSubscription?.unsubscribe()
    this.commandTidslinjeWrapperSubscription?.unsubscribe()
    this.tidslinjerListSubscription?.unsubscribe()
    this.filteredtimelinesSubscription?.unsubscribe()
    this.titleListSubscription?.unsubscribe()
    this.currentTitleSubscription?.unsubscribe()
  }


  

  async titleChange1(title: title) {
    this.currentTitle = title;
    this.changecurrenttitle();
    console.log("Parent detected that child 1 changed title to " + JSON.stringify(this.currentTitle))

    this.timelineCommunicationService.getInitPState(this.currentTitle.id).subscribe((res) => {
      this.tidslinjerList = res;
      this.changetidslinjelist();
    
    });
  }
  changecurrenttitle() {
    this.timelineDataStorageService.changecurrentTitle(this.currentTitle)
  }
  changetidslinjelist() {
    this.timelineDataStorageService.changetidslinjerList(this.tidslinjerList)
  }
}
