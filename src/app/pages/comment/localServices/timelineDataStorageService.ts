import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { CommentModule } from "../comment.module";
import { tidslinjeCommandWrapper } from "../../../models/tidslinjeCommandWrapper";
import { tidslinje } from "../../../models/tidslinje";
import { title } from "../../../models/title";

export class timelineDataStorageService {

  selectStart = new BehaviorSubject<Number>(0);
  currentselectStart = this.selectStart.asObservable();

  changeselectStart(selectStart : Number) {
    this.selectStart.next(selectStart)
  }


  selectEnd = new BehaviorSubject<Number>(0);
  currentselectEnd = this.selectEnd.asObservable();

  changeselectEnd(selectEnd: Number) {
    this.selectEnd.next(selectEnd)
  }



  selectedText = new BehaviorSubject<String>("");
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
}
