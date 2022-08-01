import { ActionReducer, Action } from "@ngrx/store";
import { AuthUserActions } from "src/app/auth/actions";
import {reducers} from "./index";

// any meta recuder takes in the global reducer function
export function logoutMetareducer(reducer: ActionReducer<any>) {
// new recuer, that wraps it
    return function (state:any, action: Action): any {
        // inspect every action, that is dispatched
        if (action.type === AuthUserActions.logout.type) {
            // passing undefined -> all the state will be reset (is the way to reset its own state)
            return reducer(undefined, action);
        }
        // if action is not logout
        return reducer(state, action);
    }
}
