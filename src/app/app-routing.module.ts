import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginPageComponent } from "./login-page/login-page.component";
import { CustomerListComponent } from "./customer/customer-list/customer-list.component";
import { CustomerDetailComponent } from "./customer/customer-detail/customer-detail.component";
import { DeviceDetailComponent } from "./device/device-detail/device-detail.component";
import { SnScanComponent } from "./device/sn-scan/sn-scan.component";
import { TagScanComponent } from "./device/tag-scan/tag-scan.component";
import { SnScanBarcodeComponent } from "./device/sn-scan-barcode/sn-scan-barcode.component";
import { SnScanImageComponent } from './device/sn-scan-image/sn-scan-image.component';

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
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/:snscanning",
    component: SnScanComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/scan/barcode",
    component: SnScanBarcodeComponent
  },
  {
    path:
      ":groupid/:agentid/customer/:customerid/device/:deviceid/sn/scan/image",
    component: SnScanImageComponent
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
      ":groupid/:agentid/customer/:customerid/device/:deviceid/tag/:tagscanning/:istagsaving",
    component: TagScanComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
