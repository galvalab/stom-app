import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UrlPathService } from "../../shared/url-path.service";
import { TagScanService } from "../../shared/tag-scan.service";

import { WebcamImage } from "ngx-webcam";

@Component({
  selector: "app-tag-scan-image",
  templateUrl: "./tag-scan-image.component.html",
  styleUrls: ["./tag-scan-image.component.css"]
})
export class TagScanImageComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private tagScan: TagScanService,
    private router: Router,
    private urlpath: UrlPathService
  ) {}

  ngOnInit() {
    this.actRouter.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");
      const customerid: string = params.get("customerid");
      const deviceid: string = params.get("deviceid");

      // Get previous router path
      const prevurl =
        "/" +
        groupid +
        "/" +
        agentid +
        "/customer/" +
        customerid +
        "/device/" +
        deviceid +
        "/tag/scan";
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Tag Image Capture");
    });
  }

  handleImages(webcamImage: WebcamImage) {
    // Save image
    this.tagScan.setImageCaptured(webcamImage.imageAsDataUrl);
    
    this.router.navigateByUrl(this.urlpath.sharedPrevUrl.value);
  }
}
