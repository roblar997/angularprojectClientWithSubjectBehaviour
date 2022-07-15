
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { tidslinje } from "../../../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../../../models/tidslinjeCommandWrapper";
import { title } from "../../../../models/title";
import { AfterContentChecked, AfterViewChecked } from '@angular/core';
import { timelineDataStorageService } from "../../../comment/localServices/timelineDataStorageService";
import { newTextCommunicationService } from '../../../../services/newTextCommunicationService';
import { timelineCommunicationService } from '../../../../services/timelineCommunicationService';
import { Observable, Subscription } from "rxjs";
@Component({
  selector: "titlesearch",
  templateUrl: "titleSearch.html"
})
export class titleSearchComponent implements OnChanges, OnInit {
  constructor(
    private cdref: ChangeDetectorRef,private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService, private timelineDataStorageService: timelineDataStorageService) { }


  //States
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

  async ngAfterViewInit() {
 
    Promise.resolve().then(() => this.cdref.detectChanges());
  }


  async ngOnChanges(changes: SimpleChanges) {
    console.log("CHANGE!!")
    for (let property in changes) {
      if(property == "selectStart")
        console.log("Child 1 detecting change. Value is now " + (changes[property].currentValue))

      else if (property == "titleList") {
        console.log("Child 1 detecting change. Have a title list equal to" + (changes[property].currentValue))

      }
      if (property == "tidslinjerList") {
        console.log("change in list")
        this.changeselectStart()
      }
      else if (property == "currentTitle") {
        console.log("Child 1 detecting change. Have a title list equal to" + (changes[property].currentValue))

      }
    }
 
  }
  changeselectStart() {
    this.timelineDataStorageService.changeselectStart(this.selectStart)
  }

  //ID's used in HTML
  @ViewChild("titleselectTitles") titleselectTitles!: ElementRef;
  @ViewChild("btnGetText") btnGetText!: ElementRef;

  async loadText() {
    let titleAsText : String = this.titleselectTitles.nativeElement.value;

    this.newTextCommunicationService.getText(titleAsText).subscribe((res) => {
      console.log("Child 1 got following title from server: " + JSON.stringify(res))
      this.currentTitle = res;
          //Broadcast change by sending notification to parrent, such that
    //parent can broadcast change
      this.changecurrenttitle();
      this.cdref.markForCheck();
     
    });
  }

  changecurrenttitle() {
    this.timelineDataStorageService.changecurrentTitle(this.currentTitle)
  }

}
