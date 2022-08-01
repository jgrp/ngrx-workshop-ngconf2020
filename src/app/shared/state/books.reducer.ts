import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";
import {BookDetailComponent} from "../../books/components/book-detail/book-detail.component";


const createBook = (books: BookModel[], book: BookModel) => [...books, book];
const updateBook = (books: BookModel[], changes: BookModel) =>
    books.map(book => {
        return book.id === changes.id ? Object.assign({}, book, changes) : book;
    });
const deleteBook = (books: BookModel[], bookId: string) =>
    books.filter(book => bookId !== book.id);


export interface State {
    collection: BookModel[];
    activeBookId: string | null;
}

export const initialState: State = {
    collection: [],
    activeBookId: null
}

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
        return {
            ...state,
            collection: action.books
        }
    }),
    on(BooksApiActions.bookCreated, (state, action) => {
        return {
            ...state,
            collection: createBook(state.collection, action.book)
        }
    }),
    on(BooksApiActions.bookUpdated, (state, action) => {
        return {
            ...state,
            collection: updateBook(state.collection, action.book)
        }
    }),
    on(BooksApiActions.bookDeleted, (state, action) => {
        return {
            ...state,
            collection: deleteBook(state.collection, action.bookId)
        }
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
export const selectAll = (state: State) => state.collection;
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
// is the same, like above fkt
// merge multiple inputs to a result
export const selectActiveBook = createSelector(
    selectAll, // first param
    selectActiveBookId, // second param
    (books, activeBookId) => {
        return books.find(book => book.id === activeBookId)
    }
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
