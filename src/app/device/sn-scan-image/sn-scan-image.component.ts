import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UrlPathService } from "../../shared/url-path.service";
import { SnScanService } from "../../shared/sn-scan.service";

import { WebcamImage } from "ngx-webcam";

@Component({
  selector: "app-sn-scan-image",
  templateUrl: "./sn-scan-image.component.html",
  styleUrls: ["./sn-scan-image.component.css"]
})
export class SnScanImageComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private snScan: SnScanService,
    private router: Router,
    private urlpath: UrlPathService
  ) {}

  ngOnInit() {
    this.actRouter.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");
      const customerid: string = params.get("customerid");
      const deviceid: string = params.get("deviceid");
      const issnsaving: string = params.get("issnsaving");

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
        "/sn/scan";
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("SN Image Capture");
    });
  }

  handleImages(webcamImage: WebcamImage) {
    // Save image
    this.snScan.setImageCaptured(webcamImage.imageAsDataUrl);
    
    this.router.navigateByUrl(this.urlpath.sharedPrevUrl.value);
  }
}
