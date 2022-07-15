
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
  selectStart: Number = new Number();
  selectEnd: Number = new Number();
  selectedText: String = new String();
  commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>()
  tidslinjerList: Array<tidslinje> = new Array<tidslinje>()
  filteredtimelines: Array<tidslinje> = Array<tidslinje>()
  titleList: Array<String> = new Array<String>()
  currentTitle: title = new title();

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

    for (let property in changes) {
      if(property == "selectStart")
        console.log("Child 1 detecting change. Value is now " + (changes[property].currentValue))

      else if (property == "titleList") {
        console.log("Child 1 detecting change. Have a title list equal to" + (changes[property].currentValue))

      }
      if (property == "tidslinjerList") {
        console.log("change in list")
        this.selectStartChangeFun()
      }
      else if (property == "currentTitle") {
        console.log("Child 1 detecting change. Have a title list equal to" + (changes[property].currentValue))

      }
    }
 
  }

  //Get change in start and end of selection of text
  //@Input('selectStart') selectStart: Number = new Number();
  @Output() selectStartChange: EventEmitter<Number> = new EventEmitter<Number>();

  async selectStartChangeFun() {
    this.selectStartChange.emit(this.selectStart.valueOf());
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
      this.titleChangeFun();
    });
  }
 // @Input('selectEnd') selectEnd: Number = new Number();

  @Output() selectEndChange: EventEmitter<Number> = new EventEmitter<Number>();
  async selectEndChangeFun() {
    this.selectEndChange.emit(this.selectEnd.valueOf());
  }


  //Send selected text between child components
 // @Input('selectedText') selectedText:String = new String();
  @Output() selectedTextChange: EventEmitter<String> = new EventEmitter<String>();

  async selectedTextChangeFun() {
    this.selectedTextChange.emit(this.selectedText.valueOf());
  }


  //Changes from server conserning comments
  //@Input('commandTidslinjeWrapper') commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>();
  @Output() commandTidslinjeWrapperChange: EventEmitter<Array<tidslinjeCommandWrapper>> = new EventEmitter<Array<tidslinjeCommandWrapper>>();

  async commandTidslinjeWrapperFun() {
    this.commandTidslinjeWrapperChange.emit(this.commandTidslinjeWrapper);
  }


  //When choosen a title, send timelines here
  //@Input('tidslinjerList') tidslinjerList: Array<tidslinje> = new Array<tidslinje>();
  @Output() tidslinjerListChange: EventEmitter<Array<tidslinje>> = new EventEmitter<Array<tidslinje>>();

  async tidslinjerListChangeFun() {
    this.tidslinjerListChange.emit(this.tidslinjerList);
  }

  //When entering website, load all titles.
 // @Input('titleList') titleList: Array<String> = new Array<String>();
  @Output() titleListChange: EventEmitter<Array<String>> = new EventEmitter<Array<String>>();

  async titleListChangeFun() {
    this.titleListChange.emit(this.titleList);
  }

  //Current title
//  @Input('currentTitle') currentTitle: title = new title();
  @Output() currentTitleChange: EventEmitter<title> = new EventEmitter<title>();

  async titleChangeFun() {
    this.currentTitleChange.emit(this.currentTitle);
  }

  //Filtered timelines
  //Filtered timelines
  //@Input('filteredtimelines') filteredtimelines: Observable<Array<tidslinje>> = new Observable<Array<tidslinje>>();
  @Output() filteredtimelinesChange: EventEmitter<Observable<Array<tidslinje>>> = new EventEmitter<Observable<Array<tidslinje>>>();

  async filteredTimelinesChangeFun() {
   // this.filteredtimelinesChange.emit(this.filteredtimelines);
  }
}
