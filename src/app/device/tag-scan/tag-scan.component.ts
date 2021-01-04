import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WebcamImage } from "ngx-webcam";

import { Guid } from "guid-typescript";

import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { TagScanService } from "../../shared/tag-scan.service";
import { StomWsService } from "../../shared/stom-ws.service";

import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "app-tag-scan",
  templateUrl: "./tag-scan.component.html",
  styleUrls: ["./tag-scan.component.css"]
})
export class TagScanComponent implements OnInit {
  scanCoordinate: Position;
  qrResultString: string;
  imageResult;

  fileToUpload: File = null;

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private geoloc: GeolocationService,
    private urlpath: UrlPathService,
    private tagScan: TagScanService,
    private stomws: StomWsService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.qrcodeRead();
    this.imageCaptured();
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

      this.tagScanSaving(
        istagsaving,
        saveStanbyRoute,
        agentid,
        customerid,
        deviceid
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

  qrcodeRead() {
    this.qrResultString = this.tagScan.sharedTagRead.value;
  }

  setFile(event) {
    this.fileToUpload = event.target.files[0];

    if (this.fileToUpload !== null) {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileToUpload);
      reader.onload = () => {
        // this.imageResult = reader.result.toString();

        // this.tagScan.setImageCaptured(reader.result.toString());

        this.imageCompress
          .compressFile(reader.result.toString(), 0, 60, 60)
          .then(result => {
            this.imageResult = result;

            this.tagScan.setImageCaptured(result);
          });
      };
    }
  }

  imageCaptured() {
    this.imageResult = this.tagScan.sharedImageCaptured.value;
  }

  tagScanSaving(
    istagsaving: string,
    standbyRoute: string,
    agentid: string,
    cid: string,
    snid: string
  ) {
    if (istagsaving === "saving") {
      // Default set to Display Loading Animation
      this.urlpath.setLoadingAnimation(true);

      // Get Device first
      this.stomws.getDevices(agentid, cid, snid).subscribe(devResp => {
        const storef = String(Guid.create()).toUpperCase();

        const devData = [
          devResp.Body.Row[0][3],
          devResp.Body.Row[0][2],
          devResp.Body.Row[0][4],
          devResp.Body.Row[0][5],

          devResp.Body.Row[0][6],
          devResp.Body.Row[0][7],
          devResp.Body.Row[0][8],
          devResp.Body.Row[0][9],
          devResp.Body.Row[0][10],
          devResp.Body.Row[0][11],

          String(this.tagScan.sharedTagGeoAccuracy.value),
          String(this.tagScan.sharedTagGeoLatitude.value),
          String(this.tagScan.sharedTagGeoLongitude.value),
          String(this.tagScan.sharedTagGeoTimestamp.value),
          storef,
          this.tagScan.sharedTagRead.value,

          devResp.Body.Row[0][1]
        ];

        const ext = "jpeg";
        const data_url = this.tagScan.sharedImageCaptured.value;

        // Save the image first
        this.stomws
          .addQrcodeImage(snid, storef, ext, data_url)
          .subscribe(imgresp => {
            // Save the data then
            this.stomws
              .updateDevice(agentid, snid, devData)
              .subscribe(devresp => {
                // Go to view page
                this.router.navigateByUrl(standbyRoute);
              });
          });

        this.router.navigateByUrl(standbyRoute);
      });
    }
  }
}
