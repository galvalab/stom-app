import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UrlPathService {
private prevurl = new BehaviorSubject('/');
  sharedPrevUrl = this.prevurl;

  private headerText = new BehaviorSubject('STOM');
  sharedHeaderText = this.headerText;

  private backButton = new BehaviorSubject('keyboard_arrow_left');
  sharedBackButton = this.backButton;

  private loadingAnimation = new BehaviorSubject(false);
  sharedLoadingAnimation = this.loadingAnimation;

  constructor() { }

  setPrevUrl(prevurl: string) {
    this.prevurl.next(prevurl);
  }

  setHeaderText(headerText: string) {
    this.headerText.next(headerText);
  }

  setBackButton(isBack: boolean) {
    if (isBack) {
      this.backButton.next('keyboard_arrow_left');
    } else {
      this.backButton.next('');
    }
  }

  setLoadingAnimation(isDisplay: boolean){
    this.loadingAnimation.next(isDisplay);
  }

}