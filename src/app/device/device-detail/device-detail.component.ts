import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import { AngularFirestore } from "@angular/fire/firestore";
// import { AngularFireStorage } from "@angular/fire/storage";
import { StomWsService } from "../../shared/stom-ws.service";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

import { UrlPathService } from "../../shared/url-path.service";

export interface DialogData {
  devaddr: string;
  devmodel: string;
  devowner: string;
  isfinished: boolean;
  snacc: string;
  snlat: string;
  snlong: string;
  sntime: string;
  snpicref: string;
  snread: string;
  tagacc: string;
  taglat: string;
  taglong: string;
  tagtime: string;
  tagpicref: string;
  tagread: string;
  sn: string;
}

export interface DeleteDialogData {
  isDeleted: boolean;
}

export interface FinishDialogData {
  isFinished: boolean;
}

@Component({
  selector: "app-device-detail",
  templateUrl: "./device-detail.component.html",
  styleUrls: ["./device-detail.component.css"]
})
export class DeviceDetailComponent implements OnInit {
  sn: string;
  model: string;
  devAddress: string;
  deviceOwner: string;
  isPurchased: boolean;

  snRead: string;
  snPicUrl: string;
  snGeo: string;

  tagRead: string;
  tagPicUrl: string;
  tagGeo: string;
  tagOrdinalNo = "";

  input_latitude: string;
  input_longitude: string;
  input_address: string;

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    // private firestore: AngularFirestore,
    // private fireStorage: AngularFireStorage,
    private urlpath: UrlPathService,
    public dialog: MatDialog,
    private stomws: StomWsService
  ) {}

  ngOnInit() {
    // Default set to Display Loading Animation
    this.urlpath.setLoadingAnimation(true);

    this.actRouter.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");
      const customerid: string = params.get("customerid");
      const deviceid: string = params.get("deviceid");

      // Get previous router path
      const prevurl = "/" + groupid + "/" + agentid + "/customer/" + customerid;
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Device Detail");

      this.getDeviceDetail(groupid, customerid, deviceid, agentid);

      // Open Dialog if route contain edit command
      if (params.get("devcommand") === "edit") {
        // console.log('Open modify dialog');

        this.openModifyDialog(
          "/" +
            groupid +
            "/" +
            agentid +
            "/customer/" +
            customerid +
            "/device/" +
            deviceid,
          agentid,
          customerid,
          deviceid
        );
      } else if (params.get("devcommand") === "delete") {
        // console.log('Open delete dialog');

        this.openDeleteDialog(
          "/" + groupid + "/" + agentid + "/customer/" + customerid + "/device",
          "/" +
            groupid +
            "/" +
            agentid +
            "/customer/" +
            customerid +
            "/device/" +
            deviceid,
          agentid,
          deviceid
        );
      } else if (params.get("devcommand") === "finish") {
        // console.log('Open finish dialog');

        this.openFinishDialog(
          "/" + groupid + "/" + agentid + "/customer/" + customerid + "/device",
          "/" +
            groupid +
            "/" +
            agentid +
            "/customer/" +
            customerid +
            "/device/" +
            deviceid,
          agentid,
          customerid,
          deviceid
        );
      }

      // Get Custom Latitude, Longitude
      this.input_latitude = localStorage.getItem("input_latitude");
      this.input_longitude = localStorage.getItem("input_longitude");
    });
  }

  getDeviceDetail(
    groupid: string,
    customerid: string,
    deviceid: string,
    agentid: string
  ) {
    // Get Device Detail
    this.stomws.getDevices(agentid, customerid, deviceid).subscribe(resp => {
      if (resp !== null) {
        this.sn = resp.Body.Row[0][1];
        this.model = resp.Body.Row[0][2];
        this.devAddress = resp.Body.Row[0][3];

        this.deviceOwner = resp.Body.Row[0][4];

        this.snRead = resp.Body.Row[0][11];
        this.tagRead = resp.Body.Row[0][17];

        this.snGeo = resp.Body.Row[0][17] + ", " + resp.Body.Row[0][17];

        this.isPurchased =
          resp.Body.Row[0][19].toString().toLowerCase() === "true";

        if (
          resp.Body.Row[0][7].length === 0 ||
          resp.Body.Row[0][8].length === 0
        ) {
          this.snGeo = "";
        } else {
          this.snGeo = resp.Body.Row[0][7] + ", " + resp.Body.Row[0][8];
        }

        if (
          resp.Body.Row[0][13].length === 0 ||
          resp.Body.Row[0][14].length === 0
        ) {
          this.tagGeo = "";
        } else {
          this.tagGeo = resp.Body.Row[0][13] + ", " + resp.Body.Row[0][14];
        }

        // Get Sequence no
        this.tagOrdinalNo = resp.Body.Row[0][18];

        // Image of Asset Tagging
        const snref = resp.Body.Row[0][10];
        const tagref = resp.Body.Row[0][16];

        if (snref.length === 0) {
          // do nothing
        } else {
          this.stomws.getImage(snref).subscribe(imgResp => {
            if (imgResp !== null) {
              this.snPicUrl = imgResp.Body.Row[0][2];
            }
          });
        }

        if (tagref.length === 0) {
          // do nothing
        } else {
          this.stomws.getImage(tagref).subscribe(imgResp => {
            if (imgResp !== null) {
              this.tagPicUrl = imgResp.Body.Row[0][2];
            }
          });
        }

        // Custom Latitude-Longitude
        this.input_latitude = resp.Body.Row[0][20];
        this.input_longitude = resp.Body.Row[0][21];
        this.input_address = resp.Body.Row[0][22];

        this.urlpath.setLoadingAnimation(false);
      } else {
        this.urlpath.setLoadingAnimation(false);
      }
    });
  }

  openModifyDialog(
    standbyRoute: string,
    agentid: string,
    cid: string,
    snid: string
  ): void {
    this.stomws.getDevices(agentid, cid, snid).subscribe(resp => {
      this.dialog
        .open(DialogUpdateDeviceComponent, {
          width: "350px",
          data: {
            devaddr: resp.Body.Row[0][3],
            devmodel: resp.Body.Row[0][2],
            devowner: resp.Body.Row[0][4],
            isfinished: Boolean(JSON.parse(resp.Body.Row[0][5])),
            snacc: resp.Body.Row[0][6],
            snlat: resp.Body.Row[0][7],
            snlong: resp.Body.Row[0][8],
            sntime: resp.Body.Row[0][9],
            snpicref: resp.Body.Row[0][10],
            snread: resp.Body.Row[0][11],
            tagacc: resp.Body.Row[0][12],
            taglat: resp.Body.Row[0][13],
            taglong: resp.Body.Row[0][14],
            tagtime: resp.Body.Row[0][15],
            tagpicref: resp.Body.Row[0][16],
            tagread: resp.Body.Row[0][17],
            sn: resp.Body.Row[0][1]
          }
        })
        .afterClosed()
        .subscribe(result => {
          if (typeof result === "undefined") {
            this.router.navigateByUrl(standbyRoute);
            // console.log('Canceling modify');
          } else {
            this.router.navigateByUrl(standbyRoute).then(() => {
              const snData = [
                result.devaddr,
                result.devmodel,
                result.devowner,
                resp.Body.Row[0][5],
                resp.Body.Row[0][6],
                resp.Body.Row[0][7],
                resp.Body.Row[0][8],
                resp.Body.Row[0][9],
                resp.Body.Row[0][10],
                resp.Body.Row[0][11],
                resp.Body.Row[0][12],
                resp.Body.Row[0][13],
                resp.Body.Row[0][14],
                resp.Body.Row[0][15],
                resp.Body.Row[0][16],
                resp.Body.Row[0][17],
                result.sn
              ];
              this.stomws.updateDevice(agentid, snid, snData).subscribe();
            });
          }
        });
    });
  }

  openDeleteDialog(
    deleteRoute: string,
    cancelRoute: string,
    agentid: string,
    snid: string
  ): void {
    this.dialog
      .open(DialogDeleteDeviceComponent, {
        width: "350px",
        data: {
          isDeleted: true
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (typeof result === "undefined") {
          this.router.navigateByUrl(cancelRoute);
        } else {
          this.router.navigateByUrl(deleteRoute).then(() => {
            // console.log("Deleting...", result);
            console.log(localStorage.getItem("delete_reason"));
            localStorage.removeItem("delete_reason");

            this.stomws.deleteDevice(agentid, snid).subscribe();
          });
        }
      });
  }

  openFinishDialog(
    finishRoute: string,
    cancelRoute: string,
    agentid: string,
    cid: string,
    snid: string
  ): void {
    this.stomws.getDevices(agentid, cid, snid).subscribe(resp => {
      this.dialog
        .open(DialogFinishDeviceComponent, {
          width: "350px",
          data: {
            devaddr: resp.Body.Row[0][3],
            devmodel: resp.Body.Row[0][2],
            devowner: resp.Body.Row[0][4],
            isfinished: Boolean(JSON.parse(resp.Body.Row[0][5])),
            snacc: resp.Body.Row[0][6],
            snlat: resp.Body.Row[0][7],
            snlong: resp.Body.Row[0][8],
            sntime: resp.Body.Row[0][9],
            snpicref: resp.Body.Row[0][10],
            snread: resp.Body.Row[0][11],
            tagacc: resp.Body.Row[0][12],
            taglat: resp.Body.Row[0][13],
            taglong: resp.Body.Row[0][14],
            tagtime: resp.Body.Row[0][15],
            tagpicref: resp.Body.Row[0][16],
            tagread: resp.Body.Row[0][17],
            sn: resp.Body.Row[0][1]
          }
        })
        .afterClosed()
        .subscribe(result => {
          if (typeof result === "undefined") {
            this.router.navigateByUrl(cancelRoute);
          } else {
            this.router.navigateByUrl(finishRoute).then(() => {
              console.log("Finishing...");

              const snData = [
                resp.Body.Row[0][3],
                resp.Body.Row[0][2],
                resp.Body.Row[0][4],
                "1",
                resp.Body.Row[0][6],
                resp.Body.Row[0][7],
                resp.Body.Row[0][8],
                resp.Body.Row[0][9],
                resp.Body.Row[0][10],
                resp.Body.Row[0][11],
                resp.Body.Row[0][12],
                resp.Body.Row[0][13],
                resp.Body.Row[0][14],
                resp.Body.Row[0][15],
                resp.Body.Row[0][16],
                resp.Body.Row[0][17],
                resp.Body.Row[0][1]
              ];
              this.stomws.updateDevice(agentid, snid, snData).subscribe();
            });
          }
        });
    });
  }
}

@Component({
  selector: "app-dialog-update-device",
  templateUrl: "./dialog-update-device.component.html",
  styleUrls: ["./device-detail.component.css"]
})
export class DialogUpdateDeviceComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-dialog-delete-device",
  templateUrl: "./dialog-delete-device.component.html",
  styleUrls: ["./device-detail.component.css"]
})
export class DialogDeleteDeviceComponent {
  reason: string;
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onOK() {
    localStorage.setItem("delete_reason", window.btoa(this.reason));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-dialog-finish-device",
  templateUrl: "./dialog-finish-device.component.html",
  styleUrls: ["./device-detail.component.css"]
})
export class DialogFinishDeviceComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFinishDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinishDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
