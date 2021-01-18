import { Injectable } from "@angular/core";
import { Observable, Observer, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface jsonIp {
  ip: string;
}

export interface jsonIpInfo {
  asn: string;
  city: string;
  continent_code: string;
  country: string;
  country_area: string;
  country_calling_code: string;
  country_capital: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_population: string;
  country_tld: string;
  currency: string;
  currency_name: string;
  in_eu: boolean;
  ip: string;
  languages: string;
  latitude: number;
  longitude: number;
  org: string;
  postal: string;
  region: string;
  region_code: string;
  timezone: string;
  utc_offset: string;
  version: string;
}

@Injectable({
  providedIn: "root"
})
export class GeolocationService {
  constructor(private http: HttpClient) {}

  getCurrentPosition(): Observable<Position> {
    return Observable.create((observer: Observer<Position>) => {
      // Invokes getCurrentPosition method of Geolocation API.
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          observer.next(position);
          observer.complete();
        },
        (error: PositionError) => {
          console.log("Geolocation service: " + error.message);
          observer.error(error);
        }
      );
    });
  }

  getClientIp() {
    const url = "https://api.ipify.org/?format=json";

    return this.http.get<jsonIp>(url);
  }

  getClientInfo(ip: string) {
    // const url = "https://ipwhois.app/json/" + ip;
    const url = "https://ipapi.co/" + ip + "/json/";

    return this.http.get<jsonIpInfo>(url);
  }
}
