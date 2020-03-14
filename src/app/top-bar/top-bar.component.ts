import { Component, OnInit, HostListener } from "@angular/core";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";

import { UrlPathService } from "../shared/url-path.service";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent implements OnInit {
  prevroute: string;
  headerText: string;
  backButton: string;

  groupid: string;
  agentid: string;
  customerid: string;
  deviceid: string;
  invoiceid: string;

  snscanning: string;
  snbarcodescanning: string;
  snimagescanning: string;
  tagscanning: string;
  tagqrcodescanning: string;
  tagimagescanning: string;

  isCustEditor: boolean;
  isDeviceEditor: boolean;
  isSNScanSave: boolean;
  isTagScanSave: boolean;

  showProgressBar: boolean;

  constructor(
    private prevurl: UrlPathService,
    private actRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.prevurl.sharedPrevUrl.subscribe(url => {
      this.prevroute = url;
    });

    this.prevurl.sharedHeaderText.subscribe(headerText => {
      this.headerText = headerText;
    });

    this.prevurl.sharedBackButton.subscribe(backButton => {
      this.backButton = backButton;
    });

    this.prevurl.sharedLoadingAnimation.subscribe(isdisplayed => {
      this.showProgressBar = isdisplayed;
    });

    // Get Current URL
    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        this.groupid = event.state.root.firstChild.params.groupid;
        this.agentid = event.state.root.firstChild.params.agentid;
        this.customerid = event.state.root.firstChild.params.customerid;
        this.deviceid = event.state.root.firstChild.params.deviceid;
        this.invoiceid = event.state.root.firstChild.params.invoiceid;
        this.snscanning = event.state.root.firstChild.params.snscanning;
        this.tagscanning = event.state.root.firstChild.params.tagscanning;
        this.snbarcodescanning = event.state.root.firstChild.params.snbarcodescanning;
        this.snimagescanning = event.state.root.firstChild.params.snimagescanning;

        if (
          typeof this.customerid !== "undefined" &&
          typeof this.deviceid === "undefined" &&
          typeof this.invoiceid === "undefined"
        ) {
          this.isCustEditor = true;
        } else {
          this.isCustEditor = false;
        }

        if (
          typeof this.customerid !== "undefined" &&
          typeof this.deviceid !== "undefined" &&
          typeof this.invoiceid === "undefined" &&
          typeof this.snscanning === "undefined" &&
          typeof this.tagscanning === "undefined"
        ) {
          this.isDeviceEditor = true;
        } else {
          this.isDeviceEditor = false;
        }

        if (
          typeof this.customerid !== "undefined" &&
          typeof this.deviceid !== "undefined" &&
          typeof this.invoiceid === "undefined" &&
          typeof this.snscanning !== "undefined" &&
          typeof this.snbarcodescanning === "undefined" &&
          typeof this.snimagescanning === "undefined"
        ) {
          this.isSNScanSave = true;
        } else {
          this.isSNScanSave = false;
        }

        if (
          typeof this.customerid !== "undefined" &&
          typeof this.deviceid !== "undefined" &&
          typeof this.invoiceid === "undefined" &&
          typeof this.tagscanning !== "undefined" &&
          typeof this.tagqrcodescanning === "undefined" &&
          typeof this.tagimagescanning === "undefined"
        ) {
          this.isTagScanSave = true;
        } else {
          this.isTagScanSave = false;
        }
      }
    });
  }

  modifyCustomer() {
    const editUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/edit";

    this.router.navigateByUrl(editUrl);
  }

  finishCustomer() {
    const finishUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/finish";

    this.router.navigateByUrl(finishUrl);
  }

  deleteCustomer() {
    const deleteUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/delete";

    this.router.navigateByUrl(deleteUrl);
  }

  modifyDevice() {
    const editUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/device/" +
      this.deviceid +
      "/edit";

    this.router.navigateByUrl(editUrl);
  }

  deleteDevice() {
    const deleteUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/device/" +
      this.deviceid +
      "/delete";

    this.router.navigateByUrl(deleteUrl);
  }

  finishDevice() {
    const finishUrl =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/device/" +
      this.deviceid +
      "/finish";

    this.router.navigateByUrl(finishUrl);
  }

  saveSNScan() {
    const snScanSave =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/device/" +
      this.deviceid +
      "/sn/scan/saving";

    this.router.navigateByUrl(snScanSave);
  }

  saveTagScan() {
    const tagScanSave =
      "/" +
      this.groupid +
      "/" +
      this.agentid +
      "/customer/" +
      this.customerid +
      "/device/" +
      this.deviceid +
      "/tag/scan/saving";

    this.router.navigateByUrl(tagScanSave);
  }
}
