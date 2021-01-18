import { Injectable } from "@angular/core";
import { Observable, Observer, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface jsonIp {
  ip: string;
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

    return this.http.get<string>(url);
  }
}
