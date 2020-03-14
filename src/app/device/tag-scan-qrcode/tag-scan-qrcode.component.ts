import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UrlPathService } from "../../shared/url-path.service";
import { TagScanService } from "../../shared/tag-scan.service";

@Component({
  selector: "app-tag-scan-qrcode",
  templateUrl: "./tag-scan-qrcode.component.html",
  styleUrls: ["./tag-scan-qrcode.component.css"]
})
export class TagScanQrcodeComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private tagScan: TagScanService,
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
      this.urlpath.setHeaderText("Tag QRCode Scanning");
    });
  }

  onCodeResult(resultString: string) {
    this.tagScan.setTagRead(resultString);

    this.router.navigateByUrl(this.urlpath.sharedPrevUrl.value);
  }
}
