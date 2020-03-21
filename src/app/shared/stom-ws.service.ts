import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class StomWsService {
  constructor(private http: HttpClient) {}

  mobileLogin(username: string, password: string) {
    return this.http.get<string>(
      "https://dems.galva.co.id/stom/mobile/MobileLoginVerification.ashx?u=" +
        username +
        "&p=" +
        password
    );
  }
}
