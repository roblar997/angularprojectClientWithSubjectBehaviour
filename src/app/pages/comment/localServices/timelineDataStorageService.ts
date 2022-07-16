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

  filteredtimelines = new BehaviorSubject<Array<tidslinje>>([]);
  currentfilteredtimelines = this.filteredtimelines.asObservable();

  changefilteredtimelines(filteredtimelines: Array<tidslinje>) {
    this.filteredtimelines.next(filteredtimelines);
  }

  titleList = new BehaviorSubject<Array<String>>([]);
  currenttitleList = this.titleList.asObservable();

  changetitleList(titleList: Array<String>) {
    this.titleList.next(titleList);
  }
  
  currentTitle = new BehaviorSubject<title>(new title());
  currentcurrentTitle = this.currentTitle.asObservable();

  changecurrentTitle(currentTitle: title) {
    this.currentTitle.next(currentTitle)
  }

  percent = new BehaviorSubject<Number>(100);
  currentpercent = this.percent.asObservable();

  changepercent(percent: Number) {
    this.percent.next(percent)
  }
  doChange() {
    let nytidslinjeListe: tidslinje[] = JSON.parse(JSON.stringify(this.tidslinjerList.getValue()));

    this.commandTidslinjeWrapper.getValue().forEach((commandtidslinjen) => {


      //  console.log("Got command " + commandtidslinjen.command + " with timeline:" + JSON.stringify(commandtidslinjen.tidslinje))
      if (String(commandtidslinjen.command) == "ADD") {
        console.log("Supposed to do changes to timelines here. ADD ")
        let tidslinjen: tidslinje = JSON.parse(JSON.stringify(commandtidslinjen.tidslinje));
        nytidslinjeListe.push(tidslinjen);
        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
          this.currentFenwick.addTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())

        //Notify change to parrent, such that everyone now that we have a new tidslinje


      }
      else if (String(commandtidslinjen.command) == "CHANGE") {

        console.log("Supposed to do changes to timelines here. CHANGE ")
        let index = nytidslinjeListe.findIndex((x) => { return x.id.valueOf() == commandtidslinjen.tidslinje.id.valueOf() })
        nytidslinjeListe.splice(index, 1, commandtidslinjen.tidslinje)

        // console.log("State of tidslinje array: " + JSON.stringify(this.tidslinjerList));

      }
      else if (String(commandtidslinjen.command) == "REMOVE") {
        let index = nytidslinjeListe.findIndex((x) => { return x.id.valueOf() == commandtidslinjen.tidslinje.id.valueOf() })

        nytidslinjeListe.splice(index, 1)
        console.log("Supposed to do changes to timelines here. REMOVE ")
        if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
         this.currentFenwick.removeTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())



      }

    })
    //change to a updated version
    this.changetidslinjerList(nytidslinjeListe);


    let nyFiltered: tidslinje[] = this.filterListByTime(this.selectStart.getValue().valueOf(), this.selectEnd.getValue().valueOf(), this.percent.getValue().valueOf());
    this.filteredtimelines.next(nyFiltered);
  }
   filterListByTime(start: number, end: number, percent: Number) {
    return this.tidslinjerList.getValue().filter((x) => {

      if (x.start && x.end)
        return x.start.valueOf() >= start && x.end.valueOf() <= end && ((x.start.valueOf() - x.end.valueOf()) / (start - end)) * 100 >= percent;
      else
        return false;
    })

  }
}
