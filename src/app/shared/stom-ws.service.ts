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
}
