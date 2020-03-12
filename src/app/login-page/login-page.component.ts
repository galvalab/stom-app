import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MatSnackBar } from "@angular/material/snack-bar";

import { AngularFirestore } from "@angular/fire/firestore";

import { UrlPathService } from "../shared/url-path.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  hide = true;
  durationInSeconds = 5;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private urlpath: UrlPathService,
    private snackBar: MatSnackBar
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
    this.loginVerification(username, password).then((retval: string) => {
      if (retval[1] === "") {
        console.log("Wrong username/password");

        this.openSnackBar();
      } else {
        console.log('logged in');
        this.router.navigateByUrl(
          "/" + retval[0] + "/" + retval[1] + "/customer"
        );
      }

      this.urlpath.setLoadingAnimation(false);
    });
  }

  loginVerification(username: string, password: string) {
    this.urlpath.setLoadingAnimation(true);

    return new Promise(resolve => {
      this.firestore
        .collection("agent", ref =>
          ref
            .where("username", "==", username)
            .where("password", "==", password)
        )
        .get()
        .subscribe(snapshot => {
          let retAgentId: string;
          let groupid: string;

          if (snapshot.empty) {
            // console.log('Wrong username / password');
            retAgentId = "";
          } else {
            snapshot.forEach(doc => {
              groupid = String(doc.get("group"));
              retAgentId = String(doc.id);
            });
          }

          const retval = [groupid, retAgentId];
          resolve(retval);
        });
    });
  }
}

@Component({
  selector: "app-wrong-cred",
  templateUrl: "wrong-cred-snackbar.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class WrongCredSnackbarComponent {}
