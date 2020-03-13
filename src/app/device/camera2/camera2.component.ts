import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-camera2",
  templateUrl: "./camera2.component.html",
  styleUrls: ["./camera2.component.css"]
})
export class Camera2Component implements OnInit {
  @ViewChild("videoElement") videoElement: ElementRef;
  video: any;
  constructor() {}

  ngOnInit() {
    this.video = this.videoElement.nativeElement;
  }
  start() {
    this.initCamera({ video: true, audio: false });
  }
  sound() {
    this.initCamera({ video: true, audio: true });
  }

  initCamera(config: any) {
    var browser = <any>navigator;

    browser.getUserMedia =
      browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia;

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.src = window.URL.createObjectURL(stream);
      this.video.play();
    });
  }
  
}
