import { Injectable } from "@angular/core";
import { MapsAPILoader } from "@agm/core";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { tap, map, switchMap } from "rxjs/operators";
import { fromPromise } from "rxjs/observable/fromPromise";
import { Location } from "./location-model";

declare var google: any;

@Injectable()
export class GeocodeService {
  private geocoder: any;

  constructor(private mapLoader: MapsAPILoader) {}

  private initGeocoder() {
    console.log("Init geocoder!");
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return fromPromise(this.mapLoader.load()).pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  geocodeAddress(location: string): Observable<Location> {
    console.log("Start geocoding!");
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable<Location>(observer => {
          this.geocoder.geocode({ address: location }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log("Geocoding complete!");
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
              console.log("Error - ", results, " & Status - ", status);
              observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        });
      })
    );
  }
}
