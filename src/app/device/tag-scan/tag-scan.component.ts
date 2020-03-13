import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WebcamImage } from "ngx-webcam";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { TagScanService } from "../../shared/tag-scan.service";

import { BrowserQRCodeReader } from "@zxing/library";

@Component({
  selector: "app-tag-scan",
  templateUrl: "./tag-scan.component.html",
  styleUrls: ["./tag-scan.component.css"]
})
export class TagScanComponent implements OnInit {
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
    private tagScan: TagScanService
  ) {}

  ngOnInit() {
    this.runLocationService();

    this.actRouter.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");
      const customerid: string = params.get("customerid");
      const deviceid: string = params.get("deviceid");
      const istagsaving: string = params.get("istagsaving");

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
      this.urlpath.setHeaderText("Asset QR Scanning");

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

      const imgRefPath = "gs://cust-sto.appspot.com/CapturedTag";
      const imgRefName = "[" + agentid + "][" + deviceid + "].jpeg";
      this.tagScanSaving(
        istagsaving,
        saveStanbyRoute,
        docRefPath,
        imgRefPath,
        imgRefName
      );

      // Get Agent Reference
      const agentRef = "/agent/" + agentid;
      this.tagScan.setAgentRef(agentRef);
    });
  }

  runLocationService() {
    this.geoloc.getCurrentPosition().subscribe((pos: Position) => {
      this.scanCoordinate = pos;

      this.tagScan.setTagGeoLatitude(pos.coords.latitude);
      this.tagScan.setTagGeoLongitude(pos.coords.longitude);
      this.tagScan.setTagGeoAccuracy(pos.coords.accuracy);
      this.tagScan.setTagGeoTimestamp(pos.timestamp);
    });
  }

  handleImages(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;

    this.tagScan.setImageCaptured(webcamImage.imageAsBase64);

    this.qrcodeRead(webcamImage.imageAsDataUrl);
  }

  qrcodeRead(imgUrl: string) {
    const barReader = new BrowserQRCodeReader();
    barReader
      .decodeFromImage(undefined, imgUrl)
      .then(result => {
        this.qrResultString = encodeURIComponent(result.getText());

        this.tagScan.setTagRead(encodeURIComponent(result.getText()));
      })
      .catch(err => {
        // console.error(err);
        this.qrResultString = "#N/A";

        this.tagScan.setTagRead("#N/A");
      });
  }

  tagScanSaving(
    istagsaving: string,
    standbyRoute: string,
    docRefPath: string,
    imgRefPath: string,
    imgRefName: string
  ) {
    if (istagsaving === "saving") {
      this.fireStorage.storage
        .refFromURL(imgRefPath + "/" + imgRefName)
        .putString(this.tagScan.sharedImageCaptured.value, "base64", {
          contentType: "image/jpeg",
          customMetadata: {
            ordinalno: "wait for 3 second, before RE-SCAN!",
            agentid: this.tagScan.sharedAgentRef.value,
            "tag-read": this.tagScan.sharedTagRead.value
          }
        })
        .then(() => {
          // Save to firestore database
          this.firestore.doc(docRefPath).update({
            "tag-read": this.tagScan.sharedTagRead.value,
            "tag-geo-latitude": this.tagScan.sharedTagGeoLatitude.value,
            "tag-geo-longitude": this.tagScan.sharedTagGeoLongitude.value,
            "tag-geo-accuracy": this.tagScan.sharedTagGeoAccuracy.value,
            "tag-geo-timestamp": this.tagScan.sharedTagGeoTimestamp.value,
            "tag-pic": imgRefPath + "/" + imgRefName
          });
        })
        .then(() => {
          // Update Ordinal Number
          this.fireStorage.storage
            .refFromURL(imgRefPath)
            .listAll()
            .then(listItem => {
              const fCount = "000000" + listItem.items.length.toString();
              const fCountStr = fCount.substr(fCount.length - 6);

              this.fireStorage.storage
                .refFromURL(imgRefPath + "/" + imgRefName)
                .updateMetadata({
                  customMetadata: {
                    ordinalno: fCountStr
                  }
                });
            });
        })
        .then(() => {
          this.router.navigateByUrl(standbyRoute);
        });
    }
  }
}
