import { createAction } from "@ngrx/store";
import {UserModel} from "../../shared/models";
import {create} from "domain";
import {LoginEvent} from "../components/login-form";

export const enter = createAction('[User Auth] Enter');

export const login = createAction(
    "[Auth/User] Login",
    // props<{username: string, password: string }>()
    (username: string, password: string) => ({ username, password })
);

export const logout = createAction("[Auth/User] Logout");

