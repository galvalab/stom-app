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

  ////////////////////////////////////////////////////////////////////////////////////
  checkQrCode(qrcode: string) {
    const url =
      "https://dems.galva.co.id/stom/warehouse/StomWHCheckQrCode.ashx";

    const sessionCode = localStorage.getItem("sessionCode");

    const formData: any = new FormData();
    formData.append("SessionCode", sessionCode);
    formData.append("qrcode", qrcode);

    return this.http.post<wsResponseType>(url, formData);
  }
}
