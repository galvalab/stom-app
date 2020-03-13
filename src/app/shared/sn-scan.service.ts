import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SnScanService {
  private snRead = new BehaviorSubject("#N/A");
  sharedSnRead = this.snRead;

  private imageCaptured = new BehaviorSubject("");
  sharedImageCaptured = this.imageCaptured;

  private agentRef = new BehaviorSubject("");
  sharedAgentRef = this.agentRef;

  private snGeoLatitude = new BehaviorSubject(0);
  sharedSnGeoLatitude = this.snGeoLatitude;

  private snGeoLongitude = new BehaviorSubject(0);
  sharedSnGeoLongitude = this.snGeoLongitude;

  private snGeoAccuracy = new BehaviorSubject(0);
  sharedSnGeoAccuracy = this.snGeoAccuracy;

  private snGeoTimestamp = new BehaviorSubject(0);
  sharedSnGeoTimestamp = this.snGeoTimestamp;

  setSnRead(snread: string) {
    this.snRead.next(snread);
  }

  setImageCaptured(img: string) {
    this.imageCaptured.next(img);
  }

  setAgentRef(agent: string) {
    this.agentRef.next(agent);
  }

  setSnGeoLatitude(lat: number) {
    this.snGeoLatitude.next(lat);
  }

  setSnGeoLongitude(long: number) {
    this.snGeoLongitude.next(long);
  }

  setSnGeoAccuracy(acc: number) {
    this.snGeoAccuracy.next(acc);
  }

  setSnGeoTimestamp(tms: number) {
    this.snGeoTimestamp.next(tms);
  }

  constructor() {}
}
