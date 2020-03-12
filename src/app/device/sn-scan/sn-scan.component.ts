import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WebcamImage } from "ngx-webcam";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { SnScanService } from "../../shared/sn-scan.service";

import { BrowserBarcodeReader } from "@zxing/library";

declare var require: any;

@Component({
  selector: "app-sn-scan",
  templateUrl: "./sn-scan.component.html",
  styleUrls: ["./sn-scan.component.css"]
})
export class SnScanComponent implements OnInit {
  scanCoordinate: Position;
  qrResultString: string;

  webcamImage: WebcamImage = null;

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

  handleImages(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;

    // Save image
    this.snScan.setImageCaptured(webcamImage.imageAsBase64);

    // Read barcode
    this.barcodeRead(webcamImage.imageAsDataUrl);
  }

  barcodeRead(imgUrl: string) {
    const barReader = new BrowserBarcodeReader();
    barReader
      .decodeFromImage(undefined, imgUrl)
      .then(result => {
        this.qrResultString = result.getText();

        this.snScan.setSnRead(result.getText());
      })
      .catch(err => {
        // console.error(err);

        this.qrResultString = "#N/A";

        this.snScan.setSnRead("#N/A");
      });
  }

  snScanSaving(
    issnsaving: string,
    standbyRoute: string,
    docRefPath: string,
    imgRefPath: string
  ) {
    if (issnsaving === "saving") {
      this.fireStorage.storage
        .refFromURL(imgRefPath)
        .putString(this.snScan.sharedImageCaptured.value, "base64", {
          contentType: "image/jpeg"
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
