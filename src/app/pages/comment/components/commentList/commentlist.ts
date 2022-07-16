//
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TrackByFunction } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { tidslinje } from "../../../../models/tidslinje";
import { tidslinjeCommandWrapper } from "../../../../models/tidslinjeCommandWrapper";
import { title } from "../../../../models/title";
import { changeCommentModal } from "../../modal/changeCommentModal";
import { FormsModule } from '@angular/forms';
import { tidslinjeChangeForm } from "../../../../models/tidslinjeChangeForm";
import { newTextCommunicationService } from "../../../../services/newTextCommunicationService";
import { timelineCommunicationService } from "../../../../services/timelineCommunicationService";
import { timelineDataStorageService } from "../../../comment/localServices/timelineDataStorageService";
import { Observable } from "rxjs/internal/Observable";
import { of, Subscription } from "rxjs";
@Component({
  selector: "commentlist",
  templateUrl: "commentlist.html",

})
export class commentlistComponent implements OnChanges, OnInit {

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

  constructor(private cdref: ChangeDetectorRef, private modalService: NgbModal, private newTextCommunicationService: newTextCommunicationService,
    private timelineDataStorageService: timelineDataStorageService, private timelineCommunicationService: timelineCommunicationService)  {

  }
  ngAfterViewInit() {

    Promise.resolve().then(() => this.cdref.detectChanges());
  }
  async refresh() {

    this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
      //this.doChange(res2);
      this.commandTidslinjeWrapper = res2;
      this.changeCommandTidslinjeWrapper();
      return;


    });
  }
  doCheck() {
    console.log("DOING CHANGE")
  }
  async ngOnChanges(changes: SimpleChanges) {

    for (let property in changes) {

   
      
    }
  }

  ishighlighting = false;
  highlightetcommentstart!: Number;
  highlightetcommentend!: Number;

  async highlightText(id: Number) {
    console.log("Started function to highlight by id " + id.valueOf())
    let tidslinje: tidslinje = this.tidslinjerList.filter((x) => x.id == id)[0];

    if (tidslinje.start)
      this.highlightetcommentstart = tidslinje.start;
    if (tidslinje.end)
      this.highlightetcommentend = tidslinje.end;

    if (tidslinje.start && tidslinje.end )
        this.ishighlighting = true;
    else
        this.ishighlighting = false;
  }
  async getChangbox(id: Number) {
    console.log("Started function to change by id " + id.valueOf())

    let tidslinje: tidslinje = this.tidslinjerList.filter((x) => x.id == id)[0];
    let tidslinjeChangeFormen: tidslinjeChangeForm | undefined = undefined;

    if (tidslinje.like)
      tidslinjeChangeFormen = new tidslinjeChangeForm(tidslinje.user, tidslinje.text.valueOf(), "like");
    else if (tidslinje.dislike)
      tidslinjeChangeFormen  = new tidslinjeChangeForm(tidslinje.user, tidslinje.text.valueOf(), "dislike");
    else 
      tidslinjeChangeFormen  = new tidslinjeChangeForm(tidslinje.user, tidslinje.text.valueOf(), "dontknow");
      
    
    const modalRef = this.modalService.open(changeCommentModal, {

      backdrop: 'static',
      keyboard: false

    })
    modalRef.componentInstance.tidslinjechange = tidslinjeChangeFormen;
    modalRef.result.then(retur => {
      if (retur == "ok") {
        console.log("Modal is closed. List component received form data " + JSON.stringify(modalRef.componentInstance.tidslinjechange));
        this.changeTimeline(id, modalRef.componentInstance.tidslinjechange);

      }
       

      else
        console.log("Modal closed without change")
    });


  }
  async changeTimeline(id: Number, formdata: tidslinjeChangeForm) {

    let tidslinjen: tidslinje = this.tidslinjerList.filter((x) => x.id == id)[0];
    let tidslinjen2: tidslinje = new tidslinje(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)

    if (formdata.likedislikeother == "like")
      tidslinjen2 = new tidslinje(tidslinjen.id, formdata.user, tidslinjen.timestampCreated, new Date().valueOf(), tidslinjen.start, tidslinjen.end, formdata.text, true, false, tidslinjen.isdeleted, tidslinjen.texttocommentid);
    else if (formdata.likedislikeother == "dislike")
      tidslinjen2 = new tidslinje(tidslinjen.id, formdata.user, tidslinjen.timestampCreated, new Date().valueOf(), tidslinjen.start, tidslinjen.end, formdata.text, false, true, tidslinjen.isdeleted, tidslinjen.texttocommentid);
    else
      tidslinjen2 = new tidslinje(tidslinjen.id, formdata.user, tidslinjen.timestampCreated, new Date().valueOf(), tidslinjen.start, tidslinjen.end, formdata.text, false, false, tidslinjen.isdeleted, tidslinjen.texttocommentid);

    this.timelineCommunicationService.changePTimeLineById(id, tidslinjen2).subscribe((res) => {
      console.log("leaved change service")
      this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
        //this.doChange(res2);
        this.commandTidslinjeWrapper = res2;
        this.changeCommandTidslinjeWrapper();
        return;


      });
    })}

  
  changeCommandTidslinjeWrapper() {
    this.timelineDataStorageService.changecommandTidslinjeWrapper(this.commandTidslinjeWrapper)
  }
  async removeById(id: Number) {
    this.timelineCommunicationService.removePTimeLineById(id).subscribe((res) => {
      console.log("leaved remove service")
      this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
        this.commandTidslinjeWrapper = res2;
        this.changeCommandTidslinjeWrapper();
        return;


      });
    });

 
  }

}
