import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ngx-scanner",
  templateUrl: "./ngx-scanner.component.html",
  styleUrls: ["./ngx-scanner.component.css"]
})
export class NgxScannerComponent implements OnInit {
  qrResultString: string;

  constructor() {}

  ngOnInit() {}

  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }
}
