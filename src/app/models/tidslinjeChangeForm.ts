export class tidslinjeChangeForm {

  constructor(user? : String, text? : string, likeddislikeother? : string) {
    if(user) this.user = user;
    if (text) this.text = text;
    if (likeddislikeother) this.likedislikeother = likeddislikeother;
  }

  user!: String;
  text!: string;
  likedislikeother!: string;
}
