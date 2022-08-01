import {
    Action,
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createReducer,
    createSelector,
    MetaReducer
} from "@ngrx/store";
import * as fromAuth from "./auth.reducer";
import * as fromBooks from "./books.reducer";
import {logoutMetareducer} from "./logout.metareducer";


const AUTH_FEATURE_KEY = 'auth';

export interface State {
    books: fromBooks.State;
    [AUTH_FEATURE_KEY]: fromAuth.State
}

// in app.module (root) registered
export const reducers: ActionReducerMap<State> = {
    books: fromBooks.reducer,
    auth: fromAuth.reducer
};

function logger(reducer: ActionReducer<any, any>) {
    return (state: any, action: Action) => {
        console.log('previous state', state);
        console.log('action', action);

        const nextState = reducer(state, action);

        return nextState;
    }
}

// in app.module (root) registered
export const metaReducers: MetaReducer<State>[] = [
    logger,
    logoutMetareducer
];


/**
* books
* */
export const selectBooksState = (state: State) => state.books;

export const selectActiveBook_unoptimized = (state: State) => {
    const bookState = selectBooksState(state);
    return fromBooks.selectActiveBook(bookState);
};
export const selectActiveBook = createSelector(
    selectBooksState,
    fromBooks.selectActiveBook
);

export const selectAllBooks = createSelector(
    selectBooksState,
    fromBooks.selectAll
);

export const selectBooksEarningTotal = createSelector(
    selectBooksState,
    fromBooks.selectEarningsTotals
);

/**
* auth
* */

export const selectAuthState = (state: State) => state.auth;
// alternative way to write it (for bigger applications)
export const selectAuthState_featureSelector = createFeatureSelector<fromAuth.State>(AUTH_FEATURE_KEY);

export const selectGettingAuthStatus = createSelector(
    selectAuthState,
    fromAuth.selectGettingStatus
);
export const selectAuthUser = createSelector(
    selectAuthState,
    fromAuth.selectUser
);
export const selectAuthError = createSelector(
    selectAuthState,
    fromAuth.selectError
)
