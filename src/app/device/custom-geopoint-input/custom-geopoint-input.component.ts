import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { StomWsService } from "../../shared/stom-ws.service";
import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";

@Component({
  selector: "app-custom-geopoint-input",
  templateUrl: "./custom-geopoint-input.component.html",
  styleUrls: ["./custom-geopoint-input.component.css"]
})
export class CustomGeopointInputComponent implements OnInit {
  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private geoloc: GeolocationService,
    private urlpath: UrlPathService,
    private stomws: StomWsService
  ) {}

  ngOnInit() {
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
    });
  }
}
