import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { CommentModule } from "../comment.module";
import { tidslinjeCommandWrapper } from "../../../models/tidslinjeCommandWrapper";
import { tidslinje } from "../../../models/tidslinje";
import { title } from "../../../models/title";
import { ReplaySubject } from "rxjs";
import { FenwFeatureTree } from "../../../structureClasses/FenwFeatureTree";

export class timelineDataStorageService {

  currentFenwick!: FenwFeatureTree;

  selectStart = new BehaviorSubject<Number>(0);
  currentselectStart = this.selectStart.asObservable();

  changeselectStart(selectStart: Number) {
    this.selectStart.next(selectStart)
  }


  selectEnd = new BehaviorSubject<Number>(0);
  currentselectEnd = this.selectEnd.asObservable();

  changeselectEnd(selectEnd: Number) {
    this.selectEnd.next(selectEnd)


  }

  countingList = new BehaviorSubject<Array<Number>>([]);
  currentcountlingList = this.countingList.asObservable();

  changecountingList(countingList: Array<Number>) {
    this.countingList.next(countingList)


  }


  selectedText = new ReplaySubject<String>(1);
  currentselectedText = this.selectedText.asObservable();

  changeselectedText(selectedText: String) {
    this.selectedText.next(selectedText)
  }

  commandTidslinjeWrapper = new BehaviorSubject<Array<tidslinjeCommandWrapper>>([])
  currentcommandTidslinjeWrapper = this.commandTidslinjeWrapper.asObservable();

  changecommandTidslinjeWrapper(commandTidslinjeWrapper: Array<tidslinjeCommandWrapper>) {
    this.commandTidslinjeWrapper.next(commandTidslinjeWrapper);

  }

  tidslinjerList = new BehaviorSubject<Array<tidslinje>>([]);
  currenttidslinjerList = this.tidslinjerList.asObservable();

  changetidslinjerList(tidslinjerList: Array<tidslinje>) {

    this.tidslinjerList.next(tidslinjerList);
    if (this.currentTitle != undefined && this.currentTitle.getValue().text != undefined) {
      this.currentFenwick = new FenwFeatureTree(this.currentTitle.getValue().text.length);
    }


    this.tidslinjerList.getValue().forEach((x) => {
      if (x.start != undefined && x.end != undefined) {
        this.currentFenwick.addTimeline(x.start.valueOf(), x.end.valueOf())
      }
    })
    this.currentFenwick.getCountingList(0, this.currentTitle.getValue().text.length).then((res) => {
      this.countingList.next(res);
    });
  }

  filteredtimelines = new ReplaySubject<Array<tidslinje>>(1);
  currentfilteredtimelines = this.filteredtimelines.asObservable();

  changefilteredtimelines(filteredtimelines: Array<tidslinje>) {
    this.filteredtimelines.next(filteredtimelines);
  }

  titleList = new ReplaySubject<Array<String>>(1);
  currenttitleList = this.titleList.asObservable();

  changetitleList(titleList: Array<String>) {
    this.titleList.next(titleList);
  }
  
  currentTitle = new BehaviorSubject<title>(new title());
  currentcurrentTitle = this.currentTitle.asObservable();

  changecurrentTitle(currentTitle: title) {
    this.currentTitle.next(currentTitle)
  }
  doChange() {
    let nytidslinjeListe: tidslinje[] = this.tidslinjerList.getValue();

    this.commandTidslinjeWrapper.getValue().forEach((commandtidslinjen) => {


      //  console.log("Got command " + commandtidslinjen.command + " with timeline:" + JSON.stringify(commandtidslinjen.tidslinje))
      if (String(commandtidslinjen.command) == "ADD") {
        console.log("Supposed to do changes to timelines here. ADD ")
        nytidslinjeListe.push(JSON.parse(JSON.stringify(commandtidslinjen.tidslinje)));
        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
          this.currentFenwick.addTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())
        console.log("State of tidslinje array: " + JSON.stringify(this.tidslinjerList));
        //Notify change to parrent, such that everyone now that we have a new tidslinje


      }
      else if (String(commandtidslinjen.command) == "CHANGE") {

        console.log("Supposed to do changes to timelines here. CHANGE ")
        let index = nytidslinjeListe.findIndex((x) => { return x.id == commandtidslinjen.tidslinje.id })
        nytidslinjeListe.splice(index, 1, commandtidslinjen.tidslinje)

        // console.log("State of tidslinje array: " + JSON.stringify(this.tidslinjerList));

      }
      else if (String(commandtidslinjen.command) == "REMOVE") {
        let index = nytidslinjeListe.findIndex((x) => { return x.id == commandtidslinjen.tidslinje.id })

        nytidslinjeListe.splice(index, 1)
        console.log("Supposed to do changes to timelines here. REMOVE ")
        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
         this.currentFenwick.removeTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())



      }

    })
    //change to a updated version
    this.changetidslinjerList(nytidslinjeListe);
  }
}
