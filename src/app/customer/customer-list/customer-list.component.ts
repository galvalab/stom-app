import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

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
      this.nameFilter$ = new BehaviorSubject(null);
      this.customers$ = combineLatest([this.nameFilter$]).pipe(
        switchMap(([namekey]) => this.stomws.getCustomers(agentid, "0"))
      );

      this.customers$.subscribe(resp => {
        // Clear customers first
        this.customers = [];

        try {
          resp.Body.Row.forEach(item => {
            const fsCustName = item[2].toLowerCase();

            this.stomws.getDevices(agentid, item[0], "0").subscribe(snItem => {
              const custurl =
                "/" + groupid + "/" + agentid + "/customer/" + item[0];

              const snList = [];

              snItem.Body.Row.forEach(snItemArr => {
                snList.push([snItemArr[1], snItemArr[0]]);
              });

              const isFinished = false;
              const isProgress = false;

              let statusCss = "";

              if (isFinished) {
                statusCss = "customer-processed";
              } else if (isProgress) {
                statusCss = "customer-progress";
              }

              if (fsCustName.search(this.searchKeyword) === -1) {
                // Display no Customer, unless has SN Data
                snList.forEach(sn => {
                  if (
                    String(sn[0])
                      .toLowerCase()
                      .search(this.searchKeyword) !== -1 &&
                    String(this.searchKeyword).length > 0
                  ) {
                    this.customers.push([
                      custurl,
                      item[1],
                      item[2],
                      item[3].substr(0, 20).concat("..."),
                      "(SN Search: " + String(sn[0]) + ")",
                      String(sn[1]),
                      statusCss
                    ]);
                  }
                });
              } else {
                // Display Based on Customer Filter only
                this.customers.push([
                  custurl,
                  item[1],
                  item[2],
                  item[3].substr(0, 40).concat("..."),
                  undefined,
                  undefined,
                  statusCss
                ]);
              }
              this.urlpath.setLoadingAnimation(false);
            });
          });
        } catch {
          this.urlpath.setLoadingAnimation(false);
        }
      });
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
