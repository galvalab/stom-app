import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef
} from "@angular/core";

import { SnScanService } from "../../shared/sn-scan.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sn-scan-image",
  templateUrl: "./sn-scan-image.component.html",
  styleUrls: ["./sn-scan-image.component.css"]
})
export class SnScanImageComponent implements OnInit {
  @ViewChild("video", { static: true }) videoElement: ElementRef;
  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  constructor(
    private renderer: Renderer2,
    private snScan: SnScanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      alert("Sorry, camera not available.");
    }
  }

  handleError(error) {
    console.log("Error: ", error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(
      this.videoElement.nativeElement,
      "srcObject",
      stream
    );
    this.renderer.listen(this.videoElement.nativeElement, "play", event => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  capture() {
    this.renderer.setProperty(
      this.canvas.nativeElement,
      "width",
      this.videoWidth
    );
    this.renderer.setProperty(
      this.canvas.nativeElement,
      "height",
      this.videoHeight
    );
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(this.videoElement.nativeElement, 0, 0);

    const prevUrl = String(this.router.url).replace("/image", "");

    this.snScan.setImageCaptured(
      this.canvas.nativeElement.toDataURL("image/png")
    );

    // this.renderer.;
    // this.router.navigateByUrl(prevUrl);
  }
}
