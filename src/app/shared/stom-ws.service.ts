import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

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

  getCustomers(agentid: string, cid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/GetStomCustomers.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid
    );
  }

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

  addDevice(agentid: string, cid: string) {
    return this.http.get<wsResponseType>(
      "https://dems.galva.co.id/stom/mobile/AddStomDevice.ashx?agentid=" +
        agentid +
        "&cid=" +
        cid
    );
  }
}
