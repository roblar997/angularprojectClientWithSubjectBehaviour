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
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs";
@Component({
  selector: "commentlist",
  templateUrl: "commentlist.html"
})
export class commentlistComponent implements OnChanges, OnInit {
  ngOnInit(): void {

  }
  constructor(private cdref: ChangeDetectorRef, private modalService: NgbModal,private newTextCommunicationService: newTextCommunicationService,
    private timelineCommunicationService: timelineCommunicationService)  {

  }
  ngAfterViewInit() {

    Promise.resolve().then(() => this.cdref.detectChanges());
  }
  async refresh() {

    this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
      //this.doChange(res2);
      this.commandTidslinjeWrapper = res2;
      this.commandTidslinjeWrapperFun();
      return;


    });
  }
  async ngOnChanges(changes: SimpleChanges) {

    for (let property in changes) {

    
      
    }
  }
  //Get change in start and end of selection of text
  @Input('selectStart') selectStart: Number = new Number();
  @Output() selectStartChange: EventEmitter<Number> = new EventEmitter<Number>();

  async selectStartChangeFun() {
    
    this.selectStartChange.emit(this.selectStart);
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
        this.commandTidslinjeWrapperFun();
        return;


      });
    })}

  
  
  async removeById(id: Number) {
    this.timelineCommunicationService.removePTimeLineById(id).subscribe((res) => {
      console.log("leaved remove service")
      this.timelineCommunicationService.getPChanges(this.currentTitle.id).subscribe((res2) => {
        this.commandTidslinjeWrapper = res2;
        this.commandTidslinjeWrapperFun();
        return;


      });
    });

 
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
    this.selectedTextChange.emit(this.selectedText);
  }


  //Changes from server conserning comments
  @Input('commandTidslinjeWrapper') commandTidslinjeWrapper: Array<tidslinjeCommandWrapper> = new Array<tidslinjeCommandWrapper>();
  @Output() commandTidslinjeWrapperChange: EventEmitter<Array<tidslinjeCommandWrapper>> = new EventEmitter<Array<tidslinjeCommandWrapper>>();

  async commandTidslinjeWrapperFun() {
    this.commandTidslinjeWrapperChange.emit(this.commandTidslinjeWrapper);
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

  async titleChangeFun() {
    this.currentTitleChange.emit(this.currentTitle);
  }

  //Filtered timelines
  @Input('filteredtimelines') filteredtimelines: Observable<Array<tidslinje>> = new Observable<Array<tidslinje>>();
  @Output() filteredtimelinesChange: EventEmitter<Observable<Array<tidslinje>>> = new EventEmitter<Observable<Array<tidslinje>>>();

  async filteredTimelinesChangeFun() {
    this.filteredtimelinesChange.emit(this.filteredtimelines);
  }
}
