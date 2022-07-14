
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TrackByFunction, ViewChild } from "@angular/core";
import { of } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { tidslinje } from "../../../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../../../models/tidslinjeCommandWrapper";
import { title } from "../../../../models/title";
import { FenwFeatureTree } from "../../../../structureClasses/FenwFeatureTree";

@Component({
  selector: "commentsearchinfo",
  templateUrl: "commentSearchInfo.html"
})
export class commentSearchInfoComponent implements OnChanges, OnInit{
  ngOnInit(): void {
    //TESTING!!
    this.selectedText = "textPart 1 "
    this.selectedTextChangeFun();
  }
  constructor(
    private cdref: ChangeDetectorRef) { }
  ngAfterViewInit() {

    Promise.resolve().then(() => this.cdref.detectChanges());
  }
  trackByIndex(index: number): number {
    return index;
  };

  async countLikes(start: Number, end: Number, percent: Number) {
    let timeLinesFilteredTime = this.filterListByTime(start.valueOf(), end.valueOf(), percent.valueOf());
    return (await timeLinesFilteredTime).reduce((nmbLikes, timeline) => {
    if (timeline.like) return nmbLikes + 1;
    else return nmbLikes;
  }, 0.0)
  }


  async countDisLikes(start: Number, end: Number, percent: Number) {
    let timeLinesFilteredTime = this.filterListByTime(start.valueOf(), end.valueOf(), percent.valueOf());
    return (await timeLinesFilteredTime).reduce((nmbDisLike, timeline) => {
    if (timeline.dislike) return nmbDisLike + 1;
    else return nmbDisLike;
  }, 0.0)
}
  async ngOnChanges(changes: SimpleChanges) {

    for (let property in changes) {
      if (property == "selectedText")
        console.log("Child 2 detecting change. Value is now " + (changes[property].currentValue))
     
      else if (property == "tidslinjerList") {

        this.likes = 0
        this.dislikes = 0
        if (this.currentTitle != undefined && this.currentTitle.text != undefined) {
          this.currentFenwick = new FenwFeatureTree(this.currentTitle.text.length);
        }

        console.log("tidslinjer is now: " + JSON.stringify(this.tidslinjerList))
        this.tidslinjerList.forEach((x) => {
          if (x.start != undefined && x.end != undefined) {
            this.currentFenwick.addTimeline(x.start.valueOf(), x.end.valueOf())
          }
        })

        this.countingList = of(await this.currentFenwick.getCountingList(0, this.currentTitle.text.length));
        console.log("Have following counting list: " + this.countingList);
      }

      else if (property == "commandTidslinjeWrapper") {
        console.log("change in command line");
        this.doChange();
        this.filteredtimelines = of(await this.filterListByTime(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value.valueOf()));
        this.likes = await this.countLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);
        this.dislikes = await  this.countDisLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);

        //Recalculate counting list
        this.countingList = of(await this.currentFenwick.getCountingList(0, this.currentTitle.text.length));

        //Send notification to parrent, such that one can broadcast this info to other childs
        this.filteredTimelinesChangeFun();
      }
 
       
    }
  } 
  //Get change in start and end of selection of text
  @Input('selectStart') selectStart: Number = new Number();
  @Output() selectStartChange: EventEmitter<Number> = new EventEmitter<Number>();

  //Like and dislikes
  likes = 0;
  dislikes = 0;


  async  selectStartChangeFun() {
    this.selectStartChange.emit(this.selectStart);
  }


  @Input('selectEnd') selectEnd: Number = new Number();

  @Output() selectEndChange: EventEmitter<Number> = new EventEmitter<Number>();
  async selectEndChangeFun() {
    this.selectEndChange.emit(this.selectEnd);
  }


  //Send selected text between child components
  @Input('selectedText') selectedText: String = new String();
  @Output() selectedTextChange: EventEmitter<String> = new EventEmitter<String>();

  async selectedTextChangeFun() {
    this.selectedTextChange.emit(this.selectedText.valueOf());
  }


  //Changes from server conserning comments
  @Input('commandTidslinjeWrapper') commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>();
  @Output() commandTidslinjeWrapperChange: EventEmitter<Array<tidslinjeCommandWrapper>> = new EventEmitter<Array<tidslinjeCommandWrapper>>();

  async commandTidslinjeWrapperFun() {
    this.commandTidslinjeWrapperChange.emit(this.commandTidslinjeWrapper);
  }

  //ID'S in HTML
  @ViewChild("textToComment") textToComment!: ElementRef;
  @ViewChild("percent") percent!: ElementRef;
  
  async captureSelected() {
    
    this.selectStart = this.textToComment.nativeElement.selectionStart;
    this.selectEnd = this.textToComment.nativeElement.selectionEnd;
    console.log("Following area is selected (start,end): (" + this.selectStart + "," + this.selectEnd + ")")
    console.log("Percent picked up is:" + this.percent.nativeElement.value)

    this.filteredtimelines = of(await this.filterListByTime(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value.valueOf()));
    this.likes = await this.countLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);
    this.dislikes = await this.countDisLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);

    //Send notification to parrent, such that one can broadcast this info to other childs
    this.selectStartChangeFun();
    this.selectEndChangeFun();
    this.filteredTimelinesChangeFun();
  }

  async filterListByTime(start: number, end: number, percent: Number) {
    return this.tidslinjerList.filter((x) => {

      if (x.start && x.end)
        return x.start.valueOf() >= start && x.end.valueOf() <= end && ((x.start.valueOf() - x.end.valueOf()) / (start - end)) * 100 >= percent;
      else
        return false;
    })
    
  }

  async doChange() {
    this.commandTidslinjeWrapper.forEach((commandtidslinjen) => {


      console.log("Got command " + commandtidslinjen.command + " with timeline:" + JSON.stringify(commandtidslinjen.tidslinje))
      if (String(commandtidslinjen.command) == "ADD") {

        this.tidslinjerList.push(JSON.parse(JSON.stringify(commandtidslinjen.tidslinje)));
        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
          this.currentFenwick.addTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())
        console.log("State of tidslinje array: " + JSON.stringify(this.tidslinjerList));
        //Notify change to parrent, such that everyone now that we have a new tidslinje


      }
      else if (String(commandtidslinjen.command) == "CHANGE") {


        let index = this.tidslinjerList.findIndex((x) => { return x.id == commandtidslinjen.tidslinje.id })
        this.tidslinjerList.splice(index, 1, commandtidslinjen.tidslinje)

        console.log("State of tidslinje array: " + JSON.stringify(this.tidslinjerList));

      }
      else if (String(commandtidslinjen.command) == "REMOVE") {
        let index = this.tidslinjerList.findIndex((x) => { return x.id == commandtidslinjen.tidslinje.id })
        this.tidslinjerList.splice(index, 1)

        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
          this.currentFenwick.removeTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())



      }

    })
    if (this.commandTidslinjeWrapper != [])
      this.tidslinjerListChangeFun();


  };
  async percentChange() {
    console.log("Percent changed to:" + this.percent.nativeElement.value)
    this.filteredtimelines = of(await this.filterListByTime(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value));
    this.likes = await this.countLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);
    this.dislikes = await this.countDisLikes(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percent.nativeElement.value);
    this.filteredTimelinesChangeFun();
 
  }

  //When choosen a title, send timelines here
  @Input('tidslinjerList') tidslinjerList: Array<tidslinje> = new Array<tidslinje>();
  @Output() tidslinjerListChange: EventEmitter<Array<tidslinje>> = new EventEmitter<Array<tidslinje>>();

  async tidslinjerListChangeFun() {
    this.tidslinjerListChange.emit(this.tidslinjerList);
  }

  //When entering website, load all titles.
  @Input('titleList') titleList: Array<String> = new Array<String>();
  @Output() titleListChange: EventEmitter<Array<String>> = new EventEmitter<Array<String>>();

  async titleListChangeFun() {
    this.titleListChange.emit(this.titleList);
  }
  //Current title
  @Input('currentTitle') currentTitle: title = new title();
  @Output() currentTitleChange: EventEmitter<title> = new EventEmitter<title>();

  currentFenwick!: FenwFeatureTree;
  countingList!: Observable<number[]>

  async titleChangeFun() {

    this.currentTitleChange.emit(this.currentTitle);
  }

  //Filtered timelines
  @Input('filteredtimelines') filteredtimelines: Observable<Array<tidslinje>> = new Observable<Array<tidslinje>>();
  @Output() filteredtimelinesChange: EventEmitter<Observable<Array<tidslinje>>> = new EventEmitter<Observable<Array<tidslinje>>>();

  async filteredTimelinesChangeFun() {
    this.filteredtimelinesChange.emit(this.filteredtimelines  );
  }
}
