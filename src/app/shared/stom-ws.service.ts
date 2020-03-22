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
}
