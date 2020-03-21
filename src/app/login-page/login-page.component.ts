import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MatSnackBar } from "@angular/material/snack-bar";

import { UrlPathService } from "../shared/url-path.service";
import { StomWsService } from "../shared/stom-ws.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  hide = true;
  durationInSeconds = 5;

  constructor(
    private router: Router,
    private urlpath: UrlPathService,
    private snackBar: MatSnackBar,
    private stomws: StomWsService
  ) {}

  ngOnInit() {
    this.urlpath.setHeaderText("STOM");
    this.urlpath.setBackButton(false);
  }

  openSnackBar() {
    this.snackBar.openFromComponent(WrongCredSnackbarComponent, {
      duration: this.durationInSeconds * 1000
    });
  }

  getAgentID(username: string, password: string) {
    // Start the animation
    this.urlpath.setLoadingAnimation(true);
    this.stomws.mobileLogin(username, password).subscribe(resp => {
      console.log(resp);

      const agentid = String(resp.Body.Row[0][0]);
      const logResp = String(resp.Body.Row[0][1]);
      const groupid = String(resp.Body.Row[0][2]);

      if (logResp === "True") {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("agentid", agentid);
        localStorage.setItem("groupid", groupid);

        this.router.navigateByUrl( "/" + agentid + "/" + groupid + "/customer");
      } else {
        this.openSnackBar();
      }

      this.urlpath.setLoadingAnimation(false);
    });
  }
}

@Component({
  selector: "app-wrong-cred",
  templateUrl: "wrong-cred-snackbar.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class WrongCredSnackbarComponent {}
