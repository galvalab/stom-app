import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WebcamImage } from "ngx-webcam";

import { Guid } from "guid-typescript";

import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { SnScanService } from "../../shared/sn-scan.service";
import { StomWsService } from "../../shared/stom-ws.service";

@Component({
  selector: "app-sn-scan",
  templateUrl: "./sn-scan.component.html",
  styleUrls: ["./sn-scan.component.css"]
})
export class SnScanComponent implements OnInit {
  scanCoordinate: Position;
  qrResultString: string;
  imageResult;

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private geoloc: GeolocationService,
    private urlpath: UrlPathService,
    private snScan: SnScanService,
    private stomws: StomWsService
  ) {}

  ngOnInit() {
    this.barcodeRead();
    this.imageCaptured();

    this.runLocationService();

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
        deviceid;
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Serial Number Scanning");

      // Listening for save command
      const saveStanbyRoute =
        "/" +
        groupid +
        "/" +
        agentid +
        "/customer/" +
        customerid +
        "/device/" +
        deviceid +
        "";
      const docRefPath =
        "/sto-activity/" +
        groupid +
        "/customer/" +
        customerid +
        "/device/" +
        deviceid;

      const imgRefPath =
        "gs://cust-sto.appspot.com/CapturedSN/" +
        agentid +
        "/" +
        deviceid +
        ".jpeg";
      this.snScanSaving(
        issnsaving,
        saveStanbyRoute,
        agentid,
        customerid,
        deviceid
      );

      // Get Agent Reference
      const agentRef = "/agent/" + agentid;
      this.snScan.setAgentRef(agentRef);
    });
  }

  runLocationService() {
    this.geoloc.getCurrentPosition().subscribe((pos: Position) => {
      this.scanCoordinate = pos;

      this.snScan.setSnGeoLatitude(pos.coords.latitude);
      this.snScan.setSnGeoLongitude(pos.coords.longitude);
      this.snScan.setSnGeoAccuracy(pos.coords.accuracy);
      this.snScan.setSnGeoTimestamp(pos.timestamp);
    });
  }

  barcodeRead() {
    this.qrResultString = this.snScan.sharedSnRead.value;
  }

  imageCaptured() {
    this.imageResult = this.snScan.sharedImageCaptured.value;
  }

  snScanSaving(
    issnsaving: string,
    standbyRoute: string,
    agentid: string,
    cid: string,
    snid: string
  ) {
    if (issnsaving === "saving") {
      // Default set to Display Loading Animation
      this.urlpath.setLoadingAnimation(true);

      // Get Device first
      this.stomws.getDevices(agentid, cid, snid).subscribe(devResp => {
        // console.log(devResp);
        const storef = String(Guid.create()).toUpperCase();

        const devData = [
          devResp.Body.Row[0][3],
          devResp.Body.Row[0][2],
          devResp.Body.Row[0][4],
          devResp.Body.Row[0][5],
          String(this.snScan.sharedSnGeoAccuracy.value),
          String(this.snScan.sharedSnGeoLatitude.value),
          String(this.snScan.sharedSnGeoLongitude.value),
          String(this.snScan.sharedSnGeoTimestamp.value),
          storef,
          this.snScan.sharedSnRead.value,
          devResp.Body.Row[0][12],
          devResp.Body.Row[0][13],
          devResp.Body.Row[0][14],
          devResp.Body.Row[0][15],
          devResp.Body.Row[0][16],
          devResp.Body.Row[0][17],
          devResp.Body.Row[0][1]
        ];

        const ext = "jpeg";
        const data_url = this.snScan.sharedImageCaptured.value;

        // Save the image first
        this.stomws
          .addBarcodeImage(storef, ext, data_url)
          .subscribe(imgresp => {
            // Save the data then
            this.stomws
              .updateDevice(agentid, snid, devData)
              .subscribe(devresp => {
                // Go to view page
                this.router.navigateByUrl(standbyRoute);
              });
          });
      });
    }
  }
}
