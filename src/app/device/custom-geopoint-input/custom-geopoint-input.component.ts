import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DeviceDetectorService } from "ngx-device-detector";
import { GeocodeService } from "../../shared/geocode.service";

import { StomWsService } from "../../shared/stom-ws.service";
import { GeolocationService } from "../../shared/geolocation.service";
import { UrlPathService } from "../../shared/url-path.service";
import { Location } from "../../shared/location-model";

@Component({
  selector: "app-custom-geopoint-input",
  templateUrl: "./custom-geopoint-input.component.html",
  styleUrls: ["./custom-geopoint-input.component.css"],
  host: {
    "(window:resize)": "onWindowResize($event)"
  }
})
export class CustomGeopointInputComponent implements OnInit {
  address = "";
  location: Location;
  loading: boolean;

  groupid: string;
  customerid: string;
  agentid: string;
  deviceid: string;

  input_latitude: string = "0.0";
  input_longitude: string = "0.0";

  dev_ip: string;

  ip_asn: string;
  ip_city: string;
  ip_continent_code: string;
  ip_country: string;
  ip_country_area: string;
  ip_country_calling_code: string;
  ip_country_capital: string;
  ip_country_code: string;
  ip_country_code_iso3: string;
  ip_country_name: string;
  ip_country_population: string;
  ip_country_tld: string;
  ip_currency: string;
  ip_currency_name: string;
  ip_in_eu: boolean;
  ip_ip: string;
  ip_languages: string;
  ip_latitude: number;
  ip_longitude: number;
  ip_org: string;
  ip_postal: string;
  ip_region: string;
  ip_region_code: string;
  ip_timezone: string;
  ip_utc_offset: string;
  ip_version: string;

  dp_ratio = window.devicePixelRatio || 1;
  dev_screenWidth: number = window.screen.width * this.dp_ratio;
  dev_screenHeight: number = window.screen.height * this.dp_ratio;
  dev_windowWidth: number = window.innerWidth;
  dev_windowHeight: number = window.innerHeight;

  dev_browser: string;
  dev_browser_version: string;
  dev_device: string;
  dev_deviceType: string;
  dev_orientation: string;
  dev_os: string;
  dev_os_version: string;
  dev_userAgent: string;

  dev_isMobile: boolean;
  dev_isTablet: boolean;
  dev_isDesktopDevice: boolean;

  gpsCoordinate: Position;

  isSaveDisplay: boolean = false;
  saveButtonTitle: string = "Waiting...";

  constructor(
    private actRouter: ActivatedRoute,
    private router: Router,
    private geoloc: GeolocationService,
    private urlpath: UrlPathService,
    private stomws: StomWsService,
    private deviceService: DeviceDetectorService,
    private geocodeService: GeocodeService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Default set to Display Loading Animation
    this.urlpath.setLoadingAnimation(true);

    this.showLocation();

    this.actRouter.paramMap.subscribe(params => {
      this.groupid = params.get("groupid");
      this.agentid = params.get("agentid");
      this.customerid = params.get("customerid");
      this.deviceid = params.get("deviceid");

      // Get previous router path
      const prevurl =
        "/" +
        this.groupid +
        "/" +
        this.agentid +
        "/customer/" +
        this.customerid +
        "/device/" +
        this.deviceid;
      this.urlpath.setPrevUrl(prevurl);

      // Set Custom Header Text
      this.urlpath.setHeaderText("Custom Geopoint Input");

      // Get Device Public IP
      this.geoloc.getClientIp().subscribe(result => {
        this.dev_ip = result.ip;

        // Get Device IP Info
        this.getIpInfo(result.ip);
      });
    });

    // Clear local storage
    localStorage.removeItem("input_latitude");
    localStorage.removeItem("input_longitude");
  }

  showLocation() {
    this.addressToCoordinates();
  }

  addressToCoordinates() {
    this.loading = true;
    this.geocodeService
      .geocodeAddress(this.address)
      .subscribe((location: Location) => {
        this.location = location;
        this.loading = false;
        this.ref.detectChanges();

        this.input_latitude = String(this.location.lat);
        this.input_longitude = String(this.location.lng);
      });
  }

  getIpInfo(ip: string) {
    this.geoloc.getClientInfo(ip).subscribe(infoResult => {
      // console.log(infoResult);

      this.ip_asn = infoResult.asn;
      this.ip_city = infoResult.city;
      this.ip_continent_code = infoResult.continent_code;
      this.ip_country = infoResult.country;
      this.ip_country_area = infoResult.country_area;
      this.ip_country_calling_code = infoResult.country_calling_code;
      this.ip_country_capital = infoResult.country_capital;
      this.ip_country_code = infoResult.country_code;
      this.ip_country_code_iso3 = infoResult.country_code_iso3;
      this.ip_country_name = infoResult.country_name;
      this.ip_country_population = infoResult.country_population;
      this.ip_country_tld = infoResult.country_tld;
      this.ip_currency = infoResult.currency;
      this.ip_currency_name = infoResult.currency_name;
      this.ip_in_eu = infoResult.in_eu;
      this.ip_ip = infoResult.ip;
      this.ip_languages = infoResult.languages;
      this.ip_latitude = infoResult.latitude;
      this.ip_longitude = infoResult.longitude;
      this.ip_org = infoResult.org;
      this.ip_postal = infoResult.postal;
      this.ip_region = infoResult.region;
      this.ip_region_code = infoResult.region_code;
      this.ip_timezone = infoResult.timezone;
      this.ip_utc_offset = infoResult.utc_offset;
      this.ip_version = infoResult.version;

      // Get GPS Coordinate
      this.geoloc.getCurrentPosition().subscribe((pos: Position) => {
        this.gpsCoordinate = pos;

        // Get Device Info
        this.getDeviceInfo();

        // Disable Animation
        this.urlpath.setLoadingAnimation(false);

        // Enable save button
        this.isSaveDisplay = true;
        this.saveButtonTitle = "Save";
      });
    });
  }

  getDeviceInfo() {
    this.dev_browser = this.deviceService.browser;
    this.dev_browser_version = this.deviceService.browser_version;
    this.dev_device = this.deviceService.device;
    this.dev_deviceType = this.deviceService.deviceType;
    this.dev_orientation = this.deviceService.orientation;
    this.dev_os = this.deviceService.os;
    this.dev_os_version = this.deviceService.os_version;
    this.dev_userAgent = this.deviceService.userAgent;

    this.dev_isMobile = this.deviceService.isMobile();
    this.dev_isTablet = this.deviceService.isTablet();
    this.dev_isDesktopDevice = this.deviceService.isDesktop();
  }

  onWindowResize(event) {
    this.dev_windowWidth = event.target.innerWidth;
    this.dev_windowHeight = event.target.innerHeight;
  }

  saveCustomGeopoint() {
    // Default set to Display Loading Animation
    this.urlpath.setLoadingAnimation(true);

    // Disable Save button
    this.isSaveDisplay = false;
    this.saveButtonTitle = "Saving...";

    const data = [
      String(this.input_latitude),
      String(this.input_longitude),

      String(this.ip_asn),
      String(this.ip_city),
      String(this.ip_continent_code),
      String(this.ip_country),
      String(this.ip_country_area),
      String(this.ip_country_calling_code),
      String(this.ip_country_capital),
      String(this.ip_country_code),
      String(this.ip_country_code_iso3),
      String(this.ip_country_name),
      String(this.ip_country_population),
      String(this.ip_country_tld),
      String(this.ip_currency),
      String(this.ip_currency_name),
      String(this.ip_in_eu),
      String(this.ip_ip),
      String(this.ip_languages),
      String(this.ip_latitude),
      String(this.ip_longitude),
      String(this.ip_org),
      String(this.ip_postal),
      String(this.ip_region),
      String(this.ip_region_code),
      String(this.ip_timezone),
      String(this.ip_utc_offset),
      String(this.ip_version),

      String(this.dev_browser),
      String(this.dev_browser_version),
      String(this.dev_device),
      String(this.dev_deviceType),
      String(this.dev_orientation),
      String(this.dev_os),
      String(this.dev_os_version),
      String(this.dev_userAgent),

      String(this.dev_isMobile),
      String(this.dev_isTablet),
      String(this.dev_isDesktopDevice),

      String(this.dev_windowWidth),
      String(this.dev_windowHeight),
      String(this.dev_screenWidth),
      String(this.dev_screenHeight),

      String(this.gpsCoordinate.coords.latitude),
      String(this.gpsCoordinate.coords.longitude),
      String(this.gpsCoordinate.coords.accuracy),
      String(this.gpsCoordinate.timestamp),

      String(this.agentid),
      String(this.deviceid)
    ];

    this.stomws.addCustomGeopoint(data).subscribe(result => {
      localStorage.setItem("input_latitude", this.input_latitude);
      localStorage.setItem("input_longitude", this.input_longitude);

      // Back to device detail
      const deviceDetailRoute =
        "/" +
        this.groupid +
        "/" +
        this.agentid +
        "/customer/" +
        this.customerid +
        "/device/" +
        this.deviceid +
        "";

      this.router.navigateByUrl(deviceDetailRoute);
    });
  }
}
