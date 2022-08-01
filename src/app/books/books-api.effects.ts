import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import {catchError, exhaustMap, map, mergeMap} from "rxjs/operators";
import { BooksService } from "../shared/services";
import { BooksPageActions, BooksApiActions } from "./actions";
import {of} from "rxjs";


// Effects class is an angular service

@Injectable()
export class BooksApiEffects{
    constructor(private actions$: Actions, private bookService: BooksService) {}

    getAllBooks$ = createEffect(() => {
        return this.actions$.pipe(
            // listen on the specific action (when user enters the bookspage)
            // listen anytime when a interaction is dispatched
            ofType(BooksPageActions.enter),
            // call and wait for the results of books is all complete and map that into another action
            // everytime the BooksPageAction enter is triggered the bookservice get all will be called
            // exhaustMap, if multiple request still only on call is need
            exhaustMap(action => {
                return this.bookService
                    .all()
                    .pipe(
                        // list of books is not assignable to the action interface
                        // map list of books into an action
                        map(books => BooksApiActions.booksLoaded({ books })),
                        // catch error in inner observable to give the outer observable to option to restart the inner process
                        catchError(err => of({ type: 'Books Load Failure'}))
                    )
            })
        )
    });

    deleteBook$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.deleteBook),
            // propably safe for the api allow multiple delets, deleted is gone
            mergeMap(action => {
                return this.bookService
                    .delete(action.bookId)
                    .pipe(
                        map(() => BooksApiActions.bookDeleted({ bookId: action.bookId}))
                    )
            })
        )
    })


}
