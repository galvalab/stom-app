import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import { AngularFirestore, DocumentData } from "@angular/fire/firestore";

import { UrlPathService } from "../../shared/url-path.service";
import { StomWsService } from "../../shared/stom-ws.service";

import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";

export interface wsResponseType {
  Header: {
    Status: string;
    Description: string;
  };
  Body: {
    ColumnName: Array<string>;
    Row: Array<Array<string>>;
  };
}

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.css"]
})
export class CustomerListComponent implements OnInit {
  customers = [];
  custSerialNumber = [];

  message: string;

  searchKeyword = "";

  panelOpenState = false;

  customers$: Observable<wsResponseType>;
  nameFilter$: BehaviorSubject<string | null>;

  constructor(
    private router: ActivatedRoute,
    private routeTo: Router,
    // private firestore: AngularFirestore,
    private urlpath: UrlPathService,
    private stomws: StomWsService
  ) {}

  ngOnInit(): void {
    // Default set to Display Loading Animation
    this.urlpath.setLoadingAnimation(true);

    this.router.paramMap.subscribe(params => {
      const groupid: string = params.get("groupid");
      const agentid: string = params.get("agentid");

      // Get previous router path
      const prevurl = "/";
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Customer");

      // Set Back Button
      this.urlpath.setBackButton(true);

      /////////////////////////////////////////////
      this.stomws.getCustomerList(agentid, "0").subscribe(resp => {
        // Clear customers first
        this.customers = [];

        resp.Body.Row.forEach(item => {
          const custurl =
            "/" + groupid + "/" + agentid + "/customer/" + item[0];

          const isFinished = false;
          const isProgress = false;

          let statusCss = "";

          if (isFinished) {
            statusCss = "customer-processed";
          } else if (isProgress) {
            statusCss = "customer-progress";
          }

          // Display Based on Customer Filter only
          this.customers.push([
            custurl,
            item[1],
            item[2],
            String(item[3])
              .substr(0, 40)
              .concat("..."),
            undefined,
            undefined,
            statusCss
          ]);
        });

        this.urlpath.setLoadingAnimation(false);
      });

      /////////////////////////////////////////////
      // this.nameFilter$ = new BehaviorSubject(null);
      // this.customers$ = combineLatest([this.nameFilter$]).pipe(
      //   switchMap(([namekey]) =>
      //     this.firestore
      //       .collection("sto-activity")
      //       .doc(groupid)
      //       .collection("customer")
      //       .snapshotChanges()
      //   )
      // );

      // this.customers$.subscribe(result => {
      //   // Clear customers first
      //   this.customers = [];
      //   result.forEach(item => {
      //     const fsCustName = String(item.payload.doc.get("name")).toLowerCase();

      //     this.firestore
      //       .collection(item.payload.doc.ref.path + "/device")
      //       .get()
      //       .subscribe(snItem => {
      //         const custurl =
      //           "/" +
      //           groupid +
      //           "/" +
      //           agentid +
      //           "/customer/" +
      //           item.payload.doc.id;

      //         const snList = [];

      //         snItem.forEach(snItemArr => {
      //           snList.push([snItemArr.get("sn"), snItemArr.id]);
      //         });

      //         const isFinished = item.payload.doc.get("is-finished");
      //         const isProgress = item.payload.doc.get("on-progress");

      //         let statusCss = "";

      //         if (isFinished) {
      //           statusCss = "customer-processed";
      //         } else if (isProgress) {
      //           statusCss = "customer-progress";
      //         }

      //         if (fsCustName.search(this.searchKeyword) === -1) {
      //           // Display no Customer, unless has SN Data
      //           snList.forEach(sn => {
      //             if (
      //               String(sn[0])
      //                 .toLowerCase()
      //                 .search(this.searchKeyword) !== -1 &&
      //               String(this.searchKeyword).length > 0
      //             ) {
      //               this.customers.push([
      //                 custurl,
      //                 item.payload.doc.get("cust-id"),
      //                 item.payload.doc.get("name"),
      //                 String(item.payload.doc.get("address"))
      //                   .substr(0, 20)
      //                   .concat("..."),
      //                 "(SN Search: " + String(sn[0]) + ")",
      //                 String(sn[1]),
      //                 statusCss
      //               ]);
      //             }
      //           });
      //         } else {
      //           // Display Based on Customer Filter only
      //           this.customers.push([
      //             custurl,
      //             item.payload.doc.get("cust-id"),
      //             item.payload.doc.get("name"),
      //             String(item.payload.doc.get("address"))
      //               .substr(0, 40)
      //               .concat("..."),
      //             undefined,
      //             undefined,
      //             statusCss
      //           ]);
      //         }

      //         this.urlpath.setLoadingAnimation(false);
      //       });
      //   });
      // });
    });
  }

  newCustomer() {
    console.log("Create new customer");
    // this.urlpath.setLoadingAnimation(true);

    // this.router.paramMap.subscribe(params => {
    //   const groupid: string = params.get("groupid");
    //   const agentid: string = params.get("agentid");

    //   this.firestore
    //     .collection("sto-activity")
    //     .doc(groupid)
    //     .collection("customer")
    //     .add({
    //       address: "",
    //       "cust-id": "NEW-" + String(Date.now()),
    //       name: ""
    //     })
    //     .then(thenparams => {
    //       let nextRoute: string;
    //       nextRoute =
    //         "/" + groupid + "/" + agentid + "/customer/" + thenparams.id;

    //       this.routeTo.navigateByUrl(nextRoute);
    //     });
    // });
  }

  onSearchTyped(event: any) {
    this.urlpath.setLoadingAnimation(true);

    this.searchKeyword = String(event.target.value).toLowerCase();
    this.routeTo.navigate([this.routeTo.url.split("?")[0]], {
      queryParams: {
        keyword: this.searchKeyword
      }
    });

    this.nameFilter$.next(this.searchKeyword);
  }
}
