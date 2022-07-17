
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TrackByFunction, ViewChild } from "@angular/core";
import { of, Subscription } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { tidslinje } from "../../../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../../../models/tidslinjeCommandWrapper";
import { title } from "../../../../models/title";
import { FenwFeatureTree } from "../../../../structureClasses/FenwFeatureTree";
import { timelineDataStorageService } from "../../../comment/localServices/timelineDataStorageService";

@Component({
  selector: "commentsearchinfo",
  templateUrl: "commentSearchInfo.html"
})
export class commentSearchInfoComponent implements OnChanges, OnInit{

  selectStart: Number = new Number();
  selectEnd: Number = new Number();
  selectedText: String = new String();
  commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>()
  tidslinjerList: Array<tidslinje> = new Array<tidslinje>()
  filteredtimelines: Array<tidslinje> = Array<tidslinje>()
  titleList: Array<String> = new Array<String>()
  currentTitle: title = new title();
  countingList: Array<Number> = new Array<Number>();
  percent: Number = new Number();
  likes: Number = new Number();
  dislikes: Number = new Number();

  //Subscriptions
  selectStartSubscription: Subscription | undefined;
  selectEndSubscription: Subscription | undefined;
  selectedTextSubscription: Subscription | undefined;
  commandTidslinjeWrapperSubscription: Subscription | undefined;
  tidslinjerListSubscription: Subscription | undefined;
  filteredtimelinesSubscription: Subscription | undefined;
  titleListSubscription: Subscription | undefined;
  currentTitleSubscription: Subscription | undefined;
  countingListSubscription: Subscription | undefined;
  percentSubscription: Subscription | undefined;
  likesSubscription: Subscription | undefined;
  dislikesSubscription: Subscription | undefined;

  ngOnInit(): void {

    this.selectStartSubscription = this.timelineDataStorageService.currentselectStart.subscribe(selectStart => this.selectStart = selectStart)
    this.selectEndSubscription = this.timelineDataStorageService.currentselectEnd.subscribe(selectEnd => this.selectEnd = selectEnd)
    this.selectedTextSubscription = this.timelineDataStorageService.currentselectedText.subscribe(selectedText => this.selectedText = selectedText)
    this.commandTidslinjeWrapperSubscription = this.timelineDataStorageService.currentcommandTidslinjeWrapper.subscribe(commandTidslinjeWrapper => this.commandTidslinjeWrapper = commandTidslinjeWrapper)
    this.tidslinjerListSubscription = this.timelineDataStorageService.currenttidslinjerList.subscribe(tidslinjerList => this.tidslinjerList = tidslinjerList)
    this.filteredtimelinesSubscription = this.timelineDataStorageService.currentfilteredtimelines.subscribe(filteredtimelines => this.filteredtimelines = filteredtimelines)
    this.titleListSubscription = this.timelineDataStorageService.currenttitleList.subscribe(titleList => this.titleList = titleList)
    this.currentTitleSubscription = this.timelineDataStorageService.currentcurrentTitle.subscribe(currentTitle => this.currentTitle = currentTitle)
    this.countingListSubscription = this.timelineDataStorageService.currentcountlingList.subscribe(countingList => this.countingList = countingList)
    this.percentSubscription = this.timelineDataStorageService.currentpercent.subscribe(percent => this.percent = percent);
    this.likesSubscription = this.timelineDataStorageService.currentlikes.subscribe(likes => this.likes = likes);
    this.dislikesSubscription = this.timelineDataStorageService.currentdislikes.subscribe(dislikes => this.dislikes = dislikes);


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
    this.countingListSubscription?.unsubscribe()
    this.percentSubscription?.unsubscribe()
    this.likesSubscription?.unsubscribe();
    this.dislikesSubscription?.unsubscribe();
  }


  constructor(
    private cdref: ChangeDetectorRef, private timelineDataStorageService: timelineDataStorageService) { }
  ngAfterViewInit() {
    
    Promise.resolve().then(() => this.cdref.detectChanges());
  }
  trackByIndex(index: number): number {
    return index;
  };


  async ngOnChanges(changes: SimpleChanges) {

    for (let property in changes) {
       if (property == "tidslinjerList") {

        this.likes = 0
        this.dislikes = 0
 

       
        console.log("Have following counting list: " + this.countingList);
      }

      else if (property == "commandTidslinjeWrapper") {
        console.log("change in command line");
        //this.doChange();

        //Recalculate counting list
      // 

        //Send notification to parrent, such that one can broadcast this info to other childs
   
      }
 
       
    }
  } 
  //Get change in start and end of selection of text
  //@Input('selectStart') selectStart: Number = new Number();
  //@Output() selectStartChange: EventEmitter<Number> = new EventEmitter<Number>();



  //ID'S in HTML
  @ViewChild("textToComment") textToComment!: ElementRef;
  @ViewChild("percentEle") percentEle!: ElementRef;
  
  async captureSelected() {
    
    this.selectStart = this.textToComment.nativeElement.selectionStart;
    this.selectEnd = this.textToComment.nativeElement.selectionEnd;
    console.log("Following area is selected (start,end): (" + this.selectStart + "," + this.selectEnd + ")")
    console.log("Percent picked up is:" + this.percentEle.nativeElement.value)

    this.filteredtimelines = await this.filterListByTime(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percentEle.nativeElement.value.valueOf());

    this.percent = this.percentEle.nativeElement.value.valueOf();

    //Send notification to parrent, such that one can broadcast this info to other childs
    this.changeSelectstart();
    this.changeselectend();
    this.changepercent();

    this.changefilteredtimelines();
  }


  changeSelectstart() {
    this.timelineDataStorageService.changeselectStart(this.selectStart)
  }
  changeselectend() {
    this.timelineDataStorageService.changeselectEnd(this.selectEnd)
  }
  changefilteredtimelines() {
    this.timelineDataStorageService.changefilteredtimelines(this.filteredtimelines)
  }

  async filterListByTime(start: number, end: number, percent: Number) {
    return this.tidslinjerList.filter((x) => {

      if (x.start && x.end)
        return x.start.valueOf() >= start && x.end.valueOf() <= end && ((x.start.valueOf() - x.end.valueOf()) / (start - end)) * 100 >= percent.valueOf();
      else
        return false;
    })
    
  }
  changepercent() {
    this.timelineDataStorageService.changepercent(this.percent)
  }
 
  changetidslinjerList() {
    this.timelineDataStorageService.changetidslinjerList(this.tidslinjerList)
  }

  async percentChange() {
    console.log("Percent changed to:" + this.percentEle.nativeElement.value)
    this.percent = this.percentEle.nativeElement.value;
    this.filteredtimelines = await this.filterListByTime(this.selectStart.valueOf(), this.selectEnd.valueOf(), this.percentEle.nativeElement.value);

    this.changepercent();

    this.changefilteredtimelines();
    
 
  }
  


}
