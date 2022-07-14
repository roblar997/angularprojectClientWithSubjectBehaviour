export class tidslinje {
  constructor(id?: Number, user?: String, timestampCreated?: any, timestampChanged?: any, start?: Number | undefined,
    end?: Number | undefined, text?: string, like?: boolean, dislike?: boolean, isdeleted?: boolean, texttocommentid? : Number) {
    if (id != undefined) this.id = id;
    if (user != undefined) this.user = user;
    if (timestampCreated != undefined) this.timestampCreated = timestampCreated;
    if (timestampChanged != undefined) this.timestampChanged = timestampChanged;
    if (start != undefined) this.start = start;
    if (end != undefined) this.end = end;
    if (text != undefined) this.text = text;
    if (like != undefined) this.like = like;
    if (dislike != undefined)  this.dislike = dislike;
    if (isdeleted != undefined) this.isdeleted = isdeleted;
    if (texttocommentid != undefined) this.texttocommentid = texttocommentid;
  }
  id!: Number;
  user!: String;
  timestampCreated?: any ;
  timestampChanged?: any;
  start?: Number | undefined;
  end?: Number | undefined;
  text!: string;
  like!:boolean;
  dislike!: boolean;
  isdeleted!: boolean;
  texttocommentid!: Number;
}
