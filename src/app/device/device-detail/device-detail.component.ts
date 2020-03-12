import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

import { UrlPathService } from "../../shared/url-path.service";

export interface DialogData {
  sn: string;
  model: string;
  shipto: string;
  devOwner: string;
  isFinished: boolean;
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

  snRead: string;
  snPicUrl: string;
  snGeo: string;

  tagRead: string;
  tagPicUrl: string;
  tagGeo: string;
  tagOrdinalNo = "";

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private urlpath: UrlPathService,
    public dialog: MatDialog
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

      this.getDeviceDetail(groupid, customerid, deviceid);

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
          "/sto-activity/" +
            groupid +
            "/customer/" +
            customerid +
            "/device/" +
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
          "/sto-activity/" +
            groupid +
            "/customer/" +
            customerid +
            "/device/" +
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
          "/sto-activity/" +
            groupid +
            "/customer/" +
            customerid +
            "/device/" +
            deviceid
        );
      }
    });
  }

  getDeviceDetail(groupid: string, customerid: string, deviceid: string) {
    // Get Device Detail
    const devicedetail = this.firestore
      .collection("sto-activity")
      .doc(groupid)
      .collection("customer")
      .doc(customerid)
      .collection("device")
      .doc(deviceid)
      .snapshotChanges();

    devicedetail.subscribe(result => {
      this.sn = result.payload.get("sn");
      this.model = result.payload.get("model");
      this.devAddress = result.payload.get("address");

      this.deviceOwner = result.payload.get("dev-owner");

      this.snRead = result.payload.get("sn-read");
      this.tagRead = result.payload.get("tag-read");

      if (
        typeof result.payload.get("sn-geo-latitude") === "undefined" ||
        typeof result.payload.get("sn-geo-longitude") === "undefined"
      ) {
        this.snGeo = "";
      } else {
        this.snGeo =
          result.payload.get("sn-geo-latitude") +
          ", " +
          result.payload.get("sn-geo-longitude");
      }

      this.tagGeo = "";
      if (
        typeof result.payload.get("tag-geo-latitude") === "undefined" ||
        typeof result.payload.get("tag-geo-longitude") === "undefined"
      ) {
        this.tagGeo = "";
      } else {
        this.tagGeo =
          result.payload.get("tag-geo-latitude") +
          ", " +
          result.payload.get("tag-geo-longitude");
      }

      const snurl = result.payload.get("sn-pic");
      const tagurl = result.payload.get("tag-pic");

      if (typeof snurl === "undefined" || String(snurl).length === 0) {
        // do nothing
      } else {
        this.fireStorage.storage
          .refFromURL(snurl)
          .getDownloadURL()
          .then(url => (this.snPicUrl = url))
          .catch(err => {
            console.log(err);
          });
      }

      if (typeof tagurl === "undefined" || String(tagurl).length === 0) {
        // do nothing
      } else {
        this.fireStorage.storage
          .refFromURL(tagurl)
          .getDownloadURL()
          .then(url => {
            this.tagPicUrl = url;
          })
          .catch(err => {
            console.log(err);
          });

        this.fireStorage.storage
          .refFromURL(tagurl)
          .getMetadata()
          .then(meta => {
            this.tagOrdinalNo = meta.customMetadata.ordinalno;
          });
      }

      this.urlpath.setLoadingAnimation(false);
    });
  }

  openModifyDialog(standbyRoute: string, docRefPath: string): void {
    this.firestore
      .doc(docRefPath)
      .get()
      .subscribe(fsdata => {
        this.dialog
          .open(DialogUpdateDeviceComponent, {
            width: "350px",
            data: {
              sn: fsdata.get("sn"),
              model: fsdata.get("model"),
              shipto: fsdata.get("address"),
              devOwner: fsdata.get("dev-owner"),
              isFinished: fsdata.get("is-finished")
            }
          })
          .afterClosed()
          .subscribe(result => {
            if (typeof result === "undefined") {
              this.router.navigateByUrl(standbyRoute);
              // console.log('Canceling modify');
            } else {
              this.router
                .navigateByUrl(standbyRoute)
                .then(() => {
                  this.firestore
                    .doc(docRefPath)
                    .get()
                    .subscribe(item => {
                      const logId = String(Date.now());

                      // Logging
                      Object.keys(item.data()).forEach(key => {
                        this.firestore
                          .doc(docRefPath)
                          .collection("log")
                          .doc(logId)
                          .set(
                            {
                              [key]: item.get(key)
                            },
                            {
                              merge: true
                            }
                          );
                      });
                    });
                })
                .then(() => {
                  this.firestore.doc(docRefPath).update({
                    address: result.shipto,
                    sn: result.sn,
                    model: result.model,
                    "dev-owner": result.devOwner,
                    "is-finished": false
                  });
                });
            }
          });
      });
  }

  openDeleteDialog(
    deleteRoute: string,
    cancelRoute: string,
    docRefPath: string
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
            // console.log('Deleting...');
            this.firestore.doc(docRefPath).delete();
          });
        }
      });
  }

  openFinishDialog(
    finishRoute: string,
    cancelRoute: string,
    docRefPath: string
  ): void {
    this.dialog
      .open(DialogFinishDeviceComponent, {
        width: "350px",
        data: {
          isFinished: true
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (typeof result === "undefined") {
          this.router.navigateByUrl(cancelRoute);
        } else {
          this.router.navigateByUrl(finishRoute).then(() => {
            // console.log('Finishing...');
            this.firestore.doc(docRefPath).update({
              "is-finished": true
            });
          });
        }
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
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

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
