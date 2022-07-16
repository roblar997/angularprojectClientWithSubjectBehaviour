import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { CommentModule } from "../comment.module";
import { tidslinjeCommandWrapper } from "../../../models/tidslinjeCommandWrapper";
import { tidslinje } from "../../../models/tidslinje";
import { title } from "../../../models/title";
import { ReplaySubject } from "rxjs";

export class timelineDataStorageService {

  selectStart = new ReplaySubject<Number>();
  currentselectStart = this.selectStart.asObservable();

  changeselectStart(selectStart: Number) {
    this.selectStart.next(selectStart)
  }


  selectEnd = new ReplaySubject<Number>();
  currentselectEnd = this.selectEnd.asObservable();

  changeselectEnd(selectEnd: Number) {
    this.selectEnd.next(selectEnd)


  }



  selectedText = new ReplaySubject<String>(1);
  currentselectedText = this.selectedText.asObservable();

  changeselectedText(selectedText: String) {
    this.selectedText.next(selectedText)
  }

  commandTidslinjeWrapper = new ReplaySubject<Array<tidslinjeCommandWrapper>>(1)
  currentcommandTidslinjeWrapper = this.commandTidslinjeWrapper.asObservable();

  changecommandTidslinjeWrapper(commandTidslinjeWrapper: Array<tidslinjeCommandWrapper>) {
    this.commandTidslinjeWrapper.next(commandTidslinjeWrapper);

  }

  tidslinjerList = new BehaviorSubject<Array<tidslinje>>([]);
  currenttidslinjerList = this.tidslinjerList.asObservable();

  changetidslinjerList(tidslinjerList: Array<tidslinje>) {
    this.tidslinjerList.next(tidslinjerList);
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

  currentTitle = new ReplaySubject<title>(1);
  currentcurrentTitle = this.currentTitle.asObservable();

  changecurrentTitle(currentTitle: title) {
    this.currentTitle.next(currentTitle)
  }
  doChange() {
    let nytidslinjeListe: tidslinje[] = this.tidslinjerList.getValue();

    this.commandTidslinjeWrapper.subscribe((x) => x.forEach((commandtidslinjen) => {


      //  console.log("Got command " + commandtidslinjen.command + " with timeline:" + JSON.stringify(commandtidslinjen.tidslinje))
      if (String(commandtidslinjen.command) == "ADD") {
        console.log("Supposed to do changes to timelines here. ADD ")
        nytidslinjeListe.push(JSON.parse(JSON.stringify(commandtidslinjen.tidslinje)));
        // if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
        //   this.currentFenwick.addTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())
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
        // if (commandtidslinjen.tidslinje && commandtidslinjen.tidslinje.start && commandtidslinjen.tidslinje.end)
        //   this.currentFenwick.removeTimeline(commandtidslinjen.tidslinje.start.valueOf(), commandtidslinjen.tidslinje.end.valueOf())



      }

    }))
    //change to a updated version
    this.changetidslinjerList(nytidslinjeListe);
  }
}
