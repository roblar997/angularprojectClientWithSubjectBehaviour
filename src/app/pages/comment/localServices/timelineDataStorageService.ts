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

  changeselectStart(selectStart : Number) {
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

  tidslinjerList = new ReplaySubject<Array<tidslinje>>(1);
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
}
