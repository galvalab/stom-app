import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TagScanService {
  private tagRead = new BehaviorSubject("#N/A");
  sharedTagRead = this.tagRead;

  private imageCaptured = new BehaviorSubject("");
  sharedImageCaptured = this.imageCaptured;

  private agentRef = new BehaviorSubject("");
  sharedAgentRef = this.agentRef;

  private tagGeoLatitude = new BehaviorSubject(0);
  sharedTagGeoLatitude = this.tagGeoLatitude;

  private tagGeoLongitude = new BehaviorSubject(0);
  sharedTagGeoLongitude = this.tagGeoLongitude;

  private tagGeoAccuracy = new BehaviorSubject(0);
  sharedTagGeoAccuracy = this.tagGeoAccuracy;

  private tagGeoTimestamp = new BehaviorSubject(0);
  sharedTagGeoTimestamp = this.tagGeoTimestamp;

  setTagRead(snread: string) {
    this.tagRead.next(snread);
  }

  setImageCaptured(img: string) {
    this.imageCaptured.next(img);
  }

  setAgentRef(agent: string) {
    this.agentRef.next(agent);
  }

  setTagGeoLatitude(lat: number) {
    this.tagGeoLatitude.next(lat);
  }

  setTagGeoLongitude(long: number) {
    this.tagGeoLongitude.next(long);
  }

  setTagGeoAccuracy(acc: number) {
    this.tagGeoAccuracy.next(acc);
  }

  setTagGeoTimestamp(tms: number) {
    this.tagGeoTimestamp.next(tms);
  }

  constructor() {}
}
