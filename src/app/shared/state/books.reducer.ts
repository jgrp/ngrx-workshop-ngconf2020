import { createReducer, on, Action, createSelector } from "@ngrx/store";
import {EntityState, createEntityAdapter, EntityAdapter} from "@ngrx/entity";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";
import {BookDetailComponent} from "../../books/components/book-detail/book-detail.component";

export interface State extends EntityState<BookModel> {
    activeBookId: string | null;
}

// by default, id of model (BookModel) will be used as identifier for the collection
const adapter: EntityAdapter<BookModel> = createEntityAdapter<BookModel>();
/* customize for using different id
* const adapter = createEntityAdapter<BookModel>({
*   selectId: (model: BookModel) => model.name,
*       // for special sorting
*   sortComparer: (a: BookModel, b: BookModel) => a.name.localCompare(b.name)
* });
* */

export const initialState: State = adapter.getInitialState({
    activeBookId: null
})

export const booksReducer = createReducer(
    initialState,
    on(
        BooksPageActions.enter,
        BooksPageActions.clearSelectedBook,
        (state, action) => {
        return {
            ...state,
            activeBookId: null
        }
    }),
    // @ts-ignore
    on(BooksPageActions.selectBook, (state, action) => {
        return {
            ...state,
            activeBookId: action.bookId
        };
    }),
    on(BooksApiActions.booksLoaded, (state, action) => {
        return adapter.setAll(action.books, state);
        // return {
        //     ...state,
        //     collection: action.books
        // }
    }),
    on(BooksApiActions.bookCreated, (state, action) => {
        return adapter.addOne(action.book, {
            ...state,
            activeBookId: null
        });
        // return {
        //     ...state,
        //     collection: createBook(state.collection, action.book)
        // }
    }),
    on(BooksApiActions.bookUpdated, (state, action) => {
        return adapter.updateOne({id: action.book.id, changes: action.book },
            {
                ...state,
                activeBookId: null
            });
        // return {
        //     ...state,
        //     collection: updateBook(state.collection, action.book)
        // }
    }),
    on(BooksApiActions.bookDeleted, (state, action) => {
        return adapter.removeOne(action.bookId, state);
        // return {
        //     ...state,
        //     collection: deleteBook(state.collection, action.bookId)
        // }
    })
    // on(BooksPageActions.book)
)

export function reducer(state: undefined | State, action: Action) {
    return booksReducer(state, action);
}

/**
* "Getter" Selectors
* just getting value out of state, not modifying or sth else
* */

export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;

/**
 * "Complex" Selectors
 * defining to inputs to this selector
 * could add injector function, that takes the results of those two selectors,
 * to create or compute a new value
 * */
export const selectActiveBook_unoptimized = (state: State) => {
    // Inputs
    const books = selectAll(state);
    const activeBookId = selectActiveBookId(state);

    // Computation
    return books.find(book => book.id === activeBookId);
}
// is the same as above fkt
// merge multiple inputs to a result
export const selectActiveBook_old = createSelector(
    selectAll, // first param
    selectActiveBookId, // second param
    (books, activeBookId) => {
        return books.find(book => book.id === activeBookId)
    }
)
// with adapter collection
export const selectActiveBook = createSelector(
    selectEntities, // first param
    selectActiveBookId, // second param
    (entities, activeBookId) => activeBookId ? entities[activeBookId] : null
)

export const selectEarningsTotals_unoptimized = createSelector(
    selectAll,
    // ngrx will only call this projector fkt, if selectAll changes
    // if any other part of state changes, it will remember the cached value of this projector fkt
    books => calculateBooksGrossEarnings(books)
)
export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings
)
