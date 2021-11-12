import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginPageComponent } from "./login-page/login-page.component";
import { CustomerListComponent } from "./customer/customer-list/customer-list.component";
import { CustomerDetailComponent } from "./customer/customer-detail/customer-detail.component";
import { DeviceDetailComponent } from "./device/device-detail/device-detail.component";
import { SnScanComponent } from "./device/sn-scan/sn-scan.component";
import { SnScanBarcodeComponent } from "./device/sn-scan-barcode/sn-scan-barcode.component";
import { TagScanComponent } from "./device/tag-scan/tag-scan.component";
import { TagScanQrcodeComponent } from "./device/tag-scan-qrcode/tag-scan-qrcode.component";

import { DeviceMoveComponent } from "./device/device-move/device-move.component";
import { DeviceMoveImageComponent } from "./device/device-move-image/device-move-image.component";

import { CustomGeopointInputComponent } from "./device/custom-geopoint-input/custom-geopoint-input.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },

  { path: ":groupid/:agentid/customer", component: CustomerListComponent },
  {
    path: ":groupid/:agentid/customer/:customerid",
    component: CustomerDetailComponent
  },
  {
    path: ":groupid/:agentid/customer/:customerid/:custcommand",
    component: CustomerDetailComponent
  },

  {
    path: ":groupid/:agentid/customer/:customerid/device/:deviceid",
    component: DeviceDetailComponent
  },
  {
    path: ":groupid/:agentid/customer/:customerid/device/:deviceid/:devcommand",
    component: DeviceDetailComponent
  },

  {
    path: ":groupid/:agentid/customer/:customerid/device/move/to/here",
    component: DeviceMoveComponent
  },
  {
    path: ":groupid/:agentid/customer/:customerid/device/move/capture/image",
    component: DeviceMoveImageComponent
  },

  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/:snscanning",
    component: SnScanComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/:snscanning/barcode/:snbarcodescanning",
    component: SnScanBarcodeComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/:snscanning/:issnsaving",
    component: SnScanComponent
  },

  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/tag/:tagscanning",
    component: TagScanComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/tag/:tagscanning/qrcode/:tagqrcodescanning",
    component: TagScanQrcodeComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/tag/:tagscanning/:istagsaving",
    component: TagScanComponent
  },

  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/geopoint/:devicetracking",
    component: CustomGeopointInputComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
