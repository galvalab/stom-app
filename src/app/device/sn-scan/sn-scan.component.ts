import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WebcamImage } from "ngx-webcam";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { SnScanService } from "../../shared/sn-scan.service";

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
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private geoloc: GeolocationService,
    private urlpath: UrlPathService,
    private snScan: SnScanService
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
      this.snScanSaving(issnsaving, saveStanbyRoute, docRefPath, imgRefPath);

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
    docRefPath: string,
    imgRefPath: string
  ) {
    if (issnsaving === "saving") {
      // Default set to Display Loading Animation
      this.urlpath.setLoadingAnimation(true);

      this.fireStorage.storage
        .refFromURL(imgRefPath)
        .putString(this.snScan.sharedImageCaptured.value, "data_url", {
          contentType: "image/jpeg",
          customMetadata: {
            agentid: this.snScan.sharedAgentRef.value,
            "sn-read": this.snScan.sharedSnRead.value
          }
        })
        .then(() => {
          this.firestore
            .doc(docRefPath)
            .update({
              "sn-read": this.snScan.sharedSnRead.value,
              "agent-ref": this.snScan.sharedAgentRef.value,
              "sn-geo-latitude": this.snScan.sharedSnGeoLatitude.value,
              "sn-geo-longitude": this.snScan.sharedSnGeoLongitude.value,
              "sn-geo-accuracy": this.snScan.sharedSnGeoAccuracy.value,
              "sn-geo-timestamp": this.snScan.sharedSnGeoTimestamp.value,
              "sn-pic": imgRefPath
            })
            .then(() => {
              this.router.navigateByUrl(standbyRoute);
            });
        });
    }
  }
}
