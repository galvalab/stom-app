import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import { AngularFirestore } from '@angular/fire/firestore';
import { StomWsService } from "../../shared/stom-ws.service";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

import { UrlPathService } from "../../shared/url-path.service";

export interface DialogData {
  customerNo: string;
  customerName: string;
  customerAddress: string;
  picName: string;
  picContact: string;
}

export interface DeleteDialogData {
  isDeleted: boolean;
}

export interface FinishDialogData {
  isFinished: boolean;
}

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.css"]
})
export class CustomerDetailComponent implements OnInit {
  customer = [];
  devices = [];
  invoices = [];

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    // private firestore: AngularFirestore,
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

      // Get previous router path
      const prevurl = "/" + groupid + "/" + agentid + "/customer";
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Customer Detail");

      // Get Customer Detail
      this.getCustomerDetail(
        groupid,
        customerid,
        agentid,
        params.get("custcommand")
      );

      // Open Dialog if route contain edit command
      if (params.get("custcommand") === "edit") {
        this.openModifyDialog(
          "/" + groupid + "/" + agentid + "/customer/" + customerid,
          "/sto-activity/" + groupid + "/customer/" + customerid
        );
      } else if (params.get("custcommand") === "delete") {
        // console.log('Open delete dialog');

        this.openDeleteDialog(
          "/" + groupid + "/" + agentid + "/customer",
          "/" + groupid + "/" + agentid + "/customer/" + customerid,
          "/sto-activity/" + groupid + "/customer/" + customerid
        );
      } else if (params.get("custcommand") === "finish") {
        // console.log('Open finish dialog');

        this.openFinishDialog(
          "/" + groupid + "/" + agentid + "/customer",
          "/" + groupid + "/" + agentid + "/customer/" + customerid,
          "/sto-activity/" + groupid + "/customer/" + customerid
        );
      }

      // Get Device List
      this.getDeviceList(groupid, customerid, agentid);

      // Get Invoice List
      this.getInvoiceList(groupid, customerid, agentid);
    });
  }

  getCustomerDetail(
    groupid: string,
    customerid: string,
    agentid: string,
    custcommand: string
  ) {
    this.stomws.getCustomers(agentid, customerid).subscribe(resp => {
      // Clear array first
      this.customer = [];
      this.customer.push(resp.Body.Row[0][1]);
      this.customer.push(resp.Body.Row[0][2]);
      this.customer.push(resp.Body.Row[0][3]);
      this.customer.push(resp.Body.Row[0][4]);
      this.customer.push(resp.Body.Row[0][5]);
      this.urlpath.setLoadingAnimation(false);

      // Set the On-Progress to TRUE

      this.urlpath.setLoadingAnimation(false);
    });
  }

  getDeviceList(groupid: string, customerid: string, agentid: string) {
    console.log("Get Device List");
    // const devicelist = this.firestore
    //   .collection('sto-activity').doc(groupid)
    //   .collection('customer').doc(customerid)
    //   .collection('device').snapshotChanges();
    // devicelist.subscribe(foundDevice => {
    //   // Clear devices first
    //   this.devices = [];
    //   const snsearch = this.actRouter.snapshot.queryParams[`snsearch`];
    //   foundDevice.forEach(device => {
    //     const nextpath =
    //       '/' + groupid +
    //       '/' + agentid +
    //       '/customer/' + customerid +
    //       '/device/' + device.payload.doc.id;
    //     if (
    //       typeof (snsearch) === 'undefined' ||
    //       snsearch === String(device.payload.doc.id)
    //     ) {
    //       const isFinished = device.payload.doc.get('is-finished');
    //       let finCSS = '';
    //       if (isFinished) {
    //         finCSS = 'device-processed';
    //       }
    //       this.devices.push([
    //         device.payload.doc.get('sn'),
    //         device.payload.doc.get('model'),
    //         nextpath,
    //         finCSS
    //       ]);
    //     }
    //   });
    // });
  }

  getInvoiceList(groupid: string, customerid: string, agentid: string) {
    // const invlist = this.firestore
    //   .collection('sto-activity').doc(groupid)
    //   .collection('customer').doc(customerid)
    //   .collection('invoice').snapshotChanges();
    // invlist.subscribe(foundinv => {
    //   // Clear invoices first
    //   this.invoices = [];
    //   foundinv.forEach(invoice => {
    //     const nextpath =
    //       '/' + groupid +
    //       '/' + agentid +
    //       '/customer/' + customerid +
    //       '/invoice/' + invoice.payload.doc.id;
    //     this.invoices.push([
    //       invoice.payload.doc.get('inv-no'),
    //       invoice.payload.doc.get('shipto'),
    //       nextpath
    //     ]);
    //   });
    // });
  }

  openModifyDialog(standbyRoute: string, docRefPath: string): void {
    // this.firestore.doc(docRefPath).get().subscribe(fsdata => {
    //   this.dialog.open(DialogUpdateCustomerComponent, {
    //     width: '350px',
    //     data: {
    //       customerName: fsdata.get('name'),
    //       customerAddress: fsdata.get('address'),
    //       picName: fsdata.get('pic-name'),
    //       picContact: fsdata.get('pic-contact'),
    //     }
    //   })
    //     .afterClosed().subscribe(result => {
    //       if (typeof (result) === 'undefined') {
    //         this.router.navigateByUrl(standbyRoute);
    //         // console.log('Canceling modify');
    //       } else {
    //         this.router.navigateByUrl(standbyRoute)
    //           .then(() => {
    //             // Write log first
    //             this.firestore.doc(docRefPath).get().subscribe(item => {
    //               const logId = String(Date.now());
    //               Object.keys(item.data()).forEach(key => {
    //                 this.firestore
    //                   .doc(docRefPath)
    //                   .collection('log').doc(logId)
    //                   .set({
    //                     [key]: item.get(key),
    //                   }, {
    //                     merge: true,
    //                   });
    //               });
    //             });
    //           })
    //           .then(() => {
    //             this.firestore.doc(docRefPath).update({
    //               address: result.customerAddress,
    //               name: result.customerName,
    //               'pic-name': result.picName,
    //               'pic-contact': result.picContact,
    //             });
    //           });
    //       }
    //     });
    // });
  }

  openFinishDialog(
    finishRoute: string,
    cancelRoute: string,
    docRefPath: string
  ): void {
    // this.dialog.open(DialogFinishCustomerComponent, {
    //   width: '350px',
    //   data: {
    //     isDeleted: true
    //   }
    // })
    //   .afterClosed().subscribe(result => {
    //     if (typeof (result) === 'undefined') {
    //       this.router.navigateByUrl(cancelRoute);
    //     } else {
    //       this.router.navigateByUrl(finishRoute)
    //         .then(() => {
    //           this.firestore.doc(docRefPath).update({
    //             'is-finished': true,
    //           });
    //         });
    //     }
    //   });
  }

  openDeleteDialog(
    deleteRoute: string,
    cancelRoute: string,
    docRefPath: string
  ): void {
    // this.dialog
    //   .open(DialogDeleteCustomerComponent, {
    //     width: "350px",
    //     data: {
    //       isDeleted: true
    //     }
    //   })
    //   .afterClosed()
    //   .subscribe(result => {
    //     if (typeof result === "undefined") {
    //       this.router.navigateByUrl(cancelRoute);
    //     } else {
    //       this.router.navigateByUrl(deleteRoute).then(() => {
    //         // console.log('Deleting...');
    //         this.firestore.doc(docRefPath).delete();
    //       });
    //     }
    //   });
  }

  newDevice() {
    // this.urlpath.setLoadingAnimation(true);
    // this.actRouter.paramMap.subscribe(params => {
    //   const groupid: string = params.get("groupid");
    //   const agentid: string = params.get("agentid");
    //   const customerid: string = params.get("customerid");
    //   this.firestore
    //     .collection("sto-activity")
    //     .doc(groupid)
    //     .collection("customer")
    //     .doc(customerid)
    //     .collection("device")
    //     .add({
    //       address: "",
    //       "agent-ref": "",
    //       "created-datetime": "",
    //       model: "",
    //       sn: "",
    //       "sn-geopoint": "",
    //       "sn-pic": "",
    //       "sn-read": "",
    //       "tag-geopoint": "",
    //       "tag-pic": "",
    //       "tag-read": ""
    //     })
    //     .then(thenparams => {
    //       let nextRoute: string;
    //       nextRoute =
    //         "/" +
    //         groupid +
    //         "/" +
    //         agentid +
    //         "/customer/" +
    //         customerid +
    //         "/device/" +
    //         thenparams.id;
    //       this.router.navigateByUrl(nextRoute);
    //     });
    // });
  }
}

@Component({
  selector: "app-dialog-update-customer",
  templateUrl: "./dialog-update-customer.component.html",
  styleUrls: ["./customer-detail.component.css"]
})
export class DialogUpdateCustomerComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogUpdateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-dialog-delete-customer",
  templateUrl: "./dialog-delete-customer.component.html",
  styleUrls: ["./customer-detail.component.css"]
})
export class DialogDeleteCustomerComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-dialog-finish-customer",
  templateUrl: "./dialog-finish-customer.component.html",
  styleUrls: ["./customer-detail.component.css"]
})
export class DialogFinishCustomerComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFinishCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinishDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
