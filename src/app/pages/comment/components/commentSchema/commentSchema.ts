
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { tidslinje } from "../../../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../../../models/tidslinjeCommandWrapper";
import { title } from "../../../../models/title";
import { newTextCommunicationService } from "../../../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../../../services/timelineCommunicationService";
import { timelineDataStorageService } from "../../../comment/localServices/timelineDataStorageService";
@Component({
  selector: "commentschema",
  templateUrl: "commentSchema.html"
})
export class commentSchemaComponent implements OnChanges, OnInit {

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


  commentSchema: FormGroup;
  constructor(
    private cdref: ChangeDetectorRef, private fb: FormBuilder,private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService, private timelineDataStorageService: timelineDataStorageService,) {
    this.commentSchema = fb.group({
      user: ["", Validators.required],
      text: ["", Validators.required],
      likedislikeother: ["", Validators.required]
    });
  }
  ngAfterViewInit() {

    Promise.resolve().then(() => this.cdref.detectChanges());
  }

  ngOnChanges(changes: SimpleChanges) {

    for (let property in changes) {

    }
  }

  async addNewComment() {
    if (this.commentSchema.valid && this.selectStart != undefined && this.selectEnd != undefined) {
      console.log("Adding new comment")
      let tidslinjen: tidslinje | undefined = undefined;

      if (this.commentSchema.value.likedislikeother=="like")
        tidslinjen = new tidslinje(-1, this.commentSchema.value.user, new Date().valueOf(), new Date().valueOf(), this.selectStart, this.selectEnd, this.commentSchema.value.text.valueOf(), true, false, false, this.currentTitle.id)
      else if (this.commentSchema.value.likedislikeother == "dislike")
        tidslinjen = new tidslinje(-1, this.commentSchema.value.user, new Date().valueOf(), new Date().valueOf(), this.selectStart, this.selectEnd, this.commentSchema.value.text.valueOf(), false, true, false, this.currentTitle.id)
      else
        tidslinjen = new tidslinje(-1, this.commentSchema.value.user, new Date().valueOf(), new Date().valueOf(), this.selectStart, this.selectEnd, this.commentSchema.value.text.valueOf(), false, false, false, this.currentTitle.id)

      this.timelineCommunicationService.sendTimePLine(tidslinjen).subscribe((res) => {
        console.log("leaved add service")
        if (tidslinjen != undefined)
          this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
        this.commandTidslinjeWrapper = res2;
        this.commandTidslinjeWrapperFun();
        return;


        });
      });
    }
  
  }
 
  //Get change in start and end of selection of text
 //@Input('selectStart') selectStart: Number = new Number();

  @Output() selectStartChange: EventEmitter<Number> = new EventEmitter<Number>();

  async selectStartChangeFun() {

    this.selectStartChange.emit(this.selectStart);
  }


  //@Input('selectEnd') selectEnd: Number = new Number();

  @Output() selectEndChange: EventEmitter<Number> = new EventEmitter<Number>();
  async selectEndChangeFun() {
    this.selectEndChange.emit(this.selectEnd);
  }


  //Send selected text between child components
  //@Input('selectedText') selectedText: String = new String();
  @Output() selectedTextChange: EventEmitter<String> = new EventEmitter<String>();

  async selectedTextChangeFun() {
    this.selectedTextChange.emit(this.selectedText.valueOf());
  }


  //Changes from server conserning comments
 // @Input('commandTidslinjeWrapper') commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>();
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
  //@Input('titleList') titleList: Array<String> = new Array<String>();
  @Output() titleListChange: EventEmitter<Array<String>> = new EventEmitter<Array<String>>();

  async titleListChangeFun() {
    this.titleListChange.emit(this.titleList);
  }
  //Current title
 // @Input('currentTitle') currentTitle: title = new title();
  @Output() currentTitleChange: EventEmitter<title> = new EventEmitter<title>();

  async titleChangeFun() {
    this.currentTitleChange.emit(this.currentTitle);
  }

  //Filtered timelines
  //@Input('filteredtimelines') filteredtimelines: Observable<Array<tidslinje>> = new Observable<Array<tidslinje>>();
  @Output() filteredtimelinesChange: EventEmitter<Observable<Array<tidslinje>>> = new EventEmitter<Observable<Array<tidslinje>>>();

  async filteredTimelinesChangeFun() {
    //this.filteredtimelinesChange.emit(this.filteredtimelines);
  }
}


