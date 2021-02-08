import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Guid } from "guid-typescript";

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

@Injectable()
export class StomWsService {
  constructor(private http: HttpClient) {}

  mobileLogin(username: string, password: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/MobileLoginVerification.ashx?u=" +
        username +
        "&p=" +
        password
    );
  }

  /////////////////////////////////////////////
  // Customer works
  getCustomers(agentid: string, cid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/GetStomCustomers.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid
    );
  }
  addCustomer(agentid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/AddStomCustomer.ashx?agentid=" +
        agentid
    );
  }

  updateCustomer(agentid: string, cid: string, custData: Array<string>) {
    const url =
      "https://dems.galva.co.id/stom/mobile/UpdateStomCustomer.ashx?agentid=" +
      agentid +
      "&cid=" +
      cid;

    const formData: any = new FormData();
    formData.append("custname", custData[0]);
    formData.append("custaddr", custData[1]);
    formData.append("picname", custData[2]);
    formData.append("picno", custData[3]);
    formData.append("view", custData[4]);
    formData.append("finish", custData[5]);

    return this.http.post<wsResponseType>(url, formData);
  }

  deleteCustomer(agentid: string, cid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/DeleteStomCustomer.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid
    );
  }

  /////////////////////////////////////////////////////////
  // Device works is below
  getDevices(agentid: string, cid: string, snid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/GetStomDevices.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid +
        "&snid=" +
        snid
    );
  }

  addDevice(agentid: string, cid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/AddStomDevice.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid
    );
  }

  updateDevice(agentid: string, snid: string, snData: Array<string>) {
    const url =
      "https://dems.galva.co.id/stom/mobile/UpdateStomDevice.ashx?agentid=" +
      agentid +
      "&snid=" +
      snid;

    const formData: any = new FormData();
    formData.append("devaddr", snData[0]);
    formData.append("devmodel", snData[1]);
    formData.append("devowner", snData[2]);
    formData.append("isfinished", snData[3]);
    formData.append("snacc", snData[4]);
    formData.append("snlat", snData[5]);
    formData.append("snlong", snData[6]);
    formData.append("sntime", snData[7]);
    formData.append("snpicref", snData[8]);
    formData.append("snread", snData[9]);
    formData.append("tagacc", snData[10]);
    formData.append("taglat", snData[11]);
    formData.append("taglong", snData[12]);
    formData.append("tagtime", snData[13]);
    formData.append("tagpicref", snData[14]);
    formData.append("tagread", snData[15]);
    formData.append("sn", snData[16]);

    return this.http.post<wsResponseType>(url, formData);
  }

  deleteDevice(agentid: string, snid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/DeleteStomDevice.ashx?agentid=" +
        agentid +
        "&snid=" +
        snid
    );
  }

  ////////////////////////////
  // IMAGE
  getImage(storef: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/GetStomImage.ashx?storef=" + storef
    );
  }

  addQrcodeImage(snid: string, storef: string, ext: string, data_url: string) {
    return this.http.post<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/AddStomQrcodeImage.ashx?snid=" +
        snid +
        "&storef=" +
        storef +
        "&ext=" +
        ext,
      data_url
    );
  }

  addBarcodeImage(storef: string, ext: string, data_url: string) {
    return this.http.post<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/AddStomBarcodeImage.ashx?" +
        "storef=" +
        storef +
        "&ext=" +
        ext,
      data_url
    );
  }

  addCustomGeopoint(devdata: Array<string>) {
    const url =
      "https://dems.galva.co.id/stom/mobile/AddStomCustomGeopoint.ashx";

    const formData: any = new FormData();
    formData.append("input_latitude", devdata[0]);
    formData.append("input_longitude", devdata[1]);
    formData.append("ip_asn", devdata[2]);
    formData.append("ip_city", devdata[3]);
    formData.append("ip_continent_code", devdata[4]);
    formData.append("ip_country", devdata[5]);
    formData.append("ip_country_area", devdata[6]);
    formData.append("ip_country_calling_code", devdata[7]);
    formData.append("ip_country_capital", devdata[8]);
    formData.append("ip_country_code", devdata[9]);
    formData.append("ip_country_code_iso3", devdata[10]);
    formData.append("ip_country_name", devdata[11]);
    formData.append("ip_country_population", devdata[12]);
    formData.append("ip_country_tld", devdata[13]);
    formData.append("ip_currency", devdata[14]);
    formData.append("ip_currency_name", devdata[15]);
    formData.append("ip_in_eu", devdata[16]);
    formData.append("ip_ip", devdata[17]);
    formData.append("ip_languages", devdata[18]);
    formData.append("ip_latitude", devdata[19]);
    formData.append("ip_longitude", devdata[20]);
    formData.append("ip_org", devdata[21]);
    formData.append("ip_postal", devdata[22]);
    formData.append("ip_region", devdata[23]);
    formData.append("ip_region_code", devdata[24]);
    formData.append("ip_timezone", devdata[25]);
    formData.append("ip_utc_offset", devdata[26]);
    formData.append("ip_version", devdata[27]);
    formData.append("dev_browser", devdata[28]);
    formData.append("dev_browser_version", devdata[29]);
    formData.append("dev_device", devdata[30]);
    formData.append("dev_deviceType", devdata[31]);
    formData.append("dev_orientation", devdata[32]);
    formData.append("dev_os", devdata[33]);
    formData.append("dev_os_version", devdata[34]);
    formData.append("dev_userAgent", devdata[35]);
    formData.append("dev_isMobile", devdata[36]);
    formData.append("dev_isTablet", devdata[37]);
    formData.append("dev_isDesktopDevice", devdata[38]);
    formData.append("dev_windowWidth", devdata[39]);
    formData.append("dev_windowHeight", devdata[40]);
    formData.append("dev_screenWidth", devdata[41]);
    formData.append("dev_screenHeight", devdata[42]);
    formData.append("gpsLatitude", devdata[43]);
    formData.append("gpsLongitude", devdata[44]);
    formData.append("gpsAccuracy", devdata[45]);
    formData.append("gpsTimestamp", devdata[46]);

    formData.append("agentid", devdata[47]);
    formData.append("snid", devdata[48]);

    formData.append("input_address", devdata[49]);

    return this.http.post<wsResponseType>(url, formData);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  checkQrCode(qrcode: string) {
    const url = "https://dems.galva.co.id/stom/mobile/CheckQrCode.ashx";

    const formData: any = new FormData();
    formData.append("qrcode", qrcode);

    return this.http.post<wsResponseType>(url, formData);
  }

  // ////////////////////////////////////////////////////////////////////////////////////
  moveDevice(
    customerid: string,
    agentid: string,
    geoAcc: string,
    geoLat: string,
    geoLong: string,
    geoTms: string,
    picRef: string,
    tagRead: string
  ) {
    const url = "https://dems.galva.co.id/stom/mobile/MoveToNewCustomer.ashx";

    const formData: any = new FormData();
    formData.append("customerid", customerid);
    formData.append("agentid", agentid);
    formData.append("geoAcc", geoAcc);
    formData.append("geoLat", geoLat);
    formData.append("geoLong", geoLong);
    formData.append("geoTms", geoTms);
    formData.append("picRef", picRef);
    formData.append("tagRead", tagRead);

    return this.http.post<wsResponseType>(url, formData);
  }
}
