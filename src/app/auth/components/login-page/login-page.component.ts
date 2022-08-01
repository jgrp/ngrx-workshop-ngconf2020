import { Component } from "@angular/core";
import { Observable, of } from "rxjs";
import {Store} from "@ngrx/store";
import { UserModel } from "src/app/shared/models";
import { AuthUserActions } from "../../actions";
import { LoginEvent } from "../login-form";
import {selectAuthError, selectGettingAuthStatus, selectAuthUser, State} from "../../../shared/state";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent {
  gettingStatus$: Observable<boolean>;
  user$: Observable<UserModel | null>;
  error$: Observable<string | null>;



  constructor(
    private store: Store<State>
  ) {
    // @ts-ignore
    this.gettingStatus$ = store.select(selectGettingAuthStatus);
    // @ts-ignore
    this.user$ = store.select(selectAuthUser);
    // @ts-ignore
    this.error$ = store.select(selectAuthError);
  }


  onLogin($event: LoginEvent) {
    // Not Implemented
    this.store.dispatch(AuthUserActions.login($event.username, $event.password));
  }
}
