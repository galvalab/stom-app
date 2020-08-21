import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UrlPathService } from "../../shared/url-path.service";
import { WebcamImage } from "ngx-webcam";

@Component({
  selector: "app-device-move-image",
  templateUrl: "./device-move-image.component.html",
  styleUrls: ["./device-move-image.component.css"]
})
export class DeviceMoveImageComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
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
        "/" + groupid + "/" + agentid + "/customer/" + customerid + "/device/move/to/here";
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Capture Qr Image");

      // Clear first
      localStorage.removeItem("devQrCodeImage");
    });
  }

  handleImages(webcamImage: WebcamImage) {
    localStorage.setItem("devQrCodeImage", webcamImage.imageAsDataUrl);
    
    this.router.navigateByUrl(this.urlpath.sharedPrevUrl.value);
  }
}
