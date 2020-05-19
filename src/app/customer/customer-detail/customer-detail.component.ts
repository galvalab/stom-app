import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  customerNo: string;
  customerName: string;
  customerAddress: string;
  picName: string;
  picContact: string;
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
          agentid,
          customerid
        );
      } else if (params.get("custcommand") === "delete") {
        // console.log('Open delete dialog');

        this.openDeleteDialog(
          "/" + groupid + "/" + agentid + "/customer",
          "/" + groupid + "/" + agentid + "/customer/" + customerid,
          agentid,
          customerid
        );
      } else if (params.get("custcommand") === "finish") {
        // console.log('Open finish dialog');

        this.openFinishDialog(
          "/" + groupid + "/" + agentid + "/customer",
          "/" + groupid + "/" + agentid + "/customer/" + customerid,
          agentid,
          customerid
        );
      }

      // Get Device List
      this.getDeviceList(groupid, customerid, agentid);
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

      // Set the On-Progress to TRUE
      const custData = [
        resp.Body.Row[0][2],
        resp.Body.Row[0][3],
        resp.Body.Row[0][4],
        resp.Body.Row[0][5],
        "1",
        "0"
      ];

      this.stomws.updateCustomer(agentid, customerid, custData).subscribe();

      this.urlpath.setLoadingAnimation(false);
    });
  }

  getDeviceList(groupid: string, customerid: string, agentid: string) {
    this.stomws.getDevices(agentid, customerid, "0").subscribe(resp => {
      // Clear devices first
      this.devices = [];
      const snsearch = this.actRouter.snapshot.queryParams[`snsearch`];

      if (resp !== null) {
        resp.Body.Row.forEach(item => {
          const nextpath =
            "/" +
            groupid +
            "/" +
            agentid +
            "/customer/" +
            customerid +
            "/device/" +
            item[0];

          if (typeof snsearch === "undefined" || snsearch === String(item[0])) {
            const isFinished = Boolean(JSON.parse(item[5]));

            let finCSS = "";
            if (isFinished) {
              finCSS = "device-processed";
            }
            this.devices.push([item[1], item[2], nextpath, finCSS]);
          }
        });
      }
    });
  }

  openModifyDialog(standbyRoute: string, agentid: string, cid: string): void {
    this.stomws.getCustomers(agentid, cid).subscribe(resp => {
      this.dialog
        .open(DialogUpdateCustomerComponent, {
          width: "350px",
          data: {
            customerName: resp.Body.Row[0][2],
            customerAddress: resp.Body.Row[0][3],
            picName: resp.Body.Row[0][4],
            picContact: resp.Body.Row[0][5]
          }
        })
        .afterClosed()
        .subscribe(result => {
          if (typeof result === "undefined") {
            this.router.navigateByUrl(standbyRoute);
            // console.log('Canceling modify');
          } else {
            this.router.navigateByUrl(standbyRoute).then(() => {
              const custData = [
                result.customerName,
                result.customerAddress,
                result.picName,
                result.picContact,
                "1",
                "0"
              ];

              this.stomws.updateCustomer(agentid, cid, custData).subscribe();
            });
          }
        });
    });
  }

  openFinishDialog(
    finishRoute: string,
    cancelRoute: string,
    agentid: string,
    cid: string
  ): void {
    this.stomws.getCustomers(agentid, cid).subscribe(resp => {
      this.dialog
        .open(DialogFinishCustomerComponent, {
          width: "350px",
          data: {
            customerName: resp.Body.Row[0][2],
            customerAddress: resp.Body.Row[0][3],
            picName: resp.Body.Row[0][4],
            picContact: resp.Body.Row[0][5]
          }
        })
        .afterClosed()
        .subscribe(result => {
          if (typeof result === "undefined") {
            this.router.navigateByUrl(cancelRoute);
            // console.log('Canceling modify');
          } else {
            this.router.navigateByUrl(finishRoute).then(() => {
              const custData = [
                result.customerName,
                result.customerAddress,
                result.picName,
                result.picContact,
                "1",
                "1"
              ];

              this.stomws.updateCustomer(agentid, cid, custData).subscribe();
            });
          }
        });
    });
  }

  openDeleteDialog(
    deleteRoute: string,
    cancelRoute: string,
    agentid: string,
    cid: string
  ): void {
    this.dialog
      .open(DialogDeleteCustomerComponent, {
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
            this.stomws.deleteCustomer(agentid, cid).subscribe();
          });
        }
      });
  }

  newDevice() {
    this.urlpath.setLoadingAnimation(true);
    this.actRouter.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");
      const customerid: string = params.get("customerid");

      this.stomws.addDevice(agentid, customerid).subscribe(resp => {
        const nextRoute =
          "/" +
          groupid +
          "/" +
          agentid +
          "/customer/" +
          customerid +
          "/device/" +
          resp.Body.Row[0][0];
        this.router.navigateByUrl(nextRoute);
      });
    });
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
