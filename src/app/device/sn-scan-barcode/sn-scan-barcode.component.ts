import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UrlPathService } from "../../shared/url-path.service";
import { SnScanService } from "../../shared/sn-scan.service";

@Component({
  selector: "app-sn-scan-barcode",
  templateUrl: "./sn-scan-barcode.component.html",
  styleUrls: ["./sn-scan-barcode.component.css"]
})
export class SnScanBarcodeComponent implements OnInit {
  previousUrl: string;

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private snScan: SnScanService,
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
      this.urlpath.setHeaderText("SN Barcode Scanning");
    });
  }

  onCodeResult(resultString: string) {
    this.snScan.setSnRead(resultString);

    this.router.navigateByUrl(this.urlpath.sharedPrevUrl.value);
  }
}
