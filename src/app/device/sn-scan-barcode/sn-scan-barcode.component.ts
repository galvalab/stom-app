import { Component, OnInit } from "@angular/core";
import { SnScanService } from "../../shared/sn-scan.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sn-scan-barcode",
  templateUrl: "./sn-scan-barcode.component.html",
  styleUrls: ["./sn-scan-barcode.component.css"]
})
export class SnScanBarcodeComponent implements OnInit {
  previousUrl: string;

  constructor(private router: Router, private snScan: SnScanService) {}

  ngOnInit() {}

  onCodeResult(resultString: string) {
    const prevUrl = String(this.router.url).replace("/barcode", "");

    this.snScan.setSnRead(resultString);

    this.router.navigateByUrl(prevUrl);
  }
}
