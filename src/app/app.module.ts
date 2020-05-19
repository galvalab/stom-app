import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { A11yModule } from "@angular/cdk/a11y";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";

import {
  LoginPageComponent,
  WrongCredSnackbarComponent
} from "./login-page/login-page.component";

import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { UrlPathService } from "./shared/url-path.service";

import { TagScanService } from "./shared/tag-scan.service";
import { SnScanService } from "./shared/sn-scan.service";
import { GeolocationService } from "./shared/geolocation.service";

import { AppRoutingModule } from "./app-routing.module";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
// import { firebase } from '@angular/fire/firebase-node';
import { environment } from "../environments/environment";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CustomerListComponent } from "./customer/customer-list/customer-list.component";
import {
  CustomerDetailComponent,
  DialogDeleteCustomerComponent,
  DialogFinishCustomerComponent,
  DialogUpdateCustomerComponent
} from "./customer/customer-detail/customer-detail.component";
import {
  DeviceDetailComponent,
  DialogDeleteDeviceComponent,
  DialogFinishDeviceComponent,
  DialogUpdateDeviceComponent
} from "./device/device-detail/device-detail.component";

import { WebcamModule } from "ngx-webcam";
import { CameraComponent } from "./device/camera/camera.component";
import { SnScanComponent } from "./device/sn-scan/sn-scan.component";
import { TagScanComponent } from "./device/tag-scan/tag-scan.component";
import { SnScanBarcodeComponent } from './device/sn-scan-barcode/sn-scan-barcode.component';
import { SnScanImageComponent } from './device/sn-scan-image/sn-scan-image.component';
import { TagScanQrcodeComponent } from './device/tag-scan-qrcode/tag-scan-qrcode.component';
import { TagScanImageComponent } from './device/tag-scan-image/tag-scan-image.component';
import { StomWsService } from './shared/stom-ws.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,

    ZXingScannerModule,

    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,

    AppRoutingModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,

    WebcamModule
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    LoginPageComponent,
    WrongCredSnackbarComponent,
    CustomerListComponent,

    CustomerDetailComponent,
    DialogUpdateCustomerComponent,
    DialogDeleteCustomerComponent,
    DialogFinishCustomerComponent,

    DeviceDetailComponent,
    DialogUpdateDeviceComponent,
    DialogDeleteDeviceComponent,
    DialogFinishDeviceComponent,
    CameraComponent,
    SnScanComponent,
    TagScanComponent,
    SnScanBarcodeComponent,
    SnScanImageComponent,
    TagScanQrcodeComponent,
    TagScanImageComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    UrlPathService,
    TagScanService,
    SnScanService,
    GeolocationService,
    StomWsService
  ],
  entryComponents: [
    WrongCredSnackbarComponent,

    DialogDeleteCustomerComponent,
    DialogFinishCustomerComponent,
    DialogUpdateCustomerComponent,

    DialogUpdateDeviceComponent,
    DialogDeleteDeviceComponent,
    DialogFinishDeviceComponent
  ]
})
export class AppModule {}
