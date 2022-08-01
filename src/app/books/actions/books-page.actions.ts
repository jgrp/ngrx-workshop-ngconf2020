import { createAction, props } from "@ngrx/store";
import { BookRequiredProps } from "src/app/shared/models";


export const enter = createAction('[Books Page] Enter');

// [Book Page] Selecting a Book
//  - ID of the book being selected
export const selectBook = createAction(
    '[Book Page] Select a Book',
    props<{ bookId: string | undefined }>()
)

// [Book Page] Clearing selection
export const clearSelectedBook = createAction(
    '[Book Page] Clear selected Book'
)

// [Book Page] Create a Book
//   - BookRequiredProps
export const createBook = createAction(
  '[Books Page] Create Book',
  props<{ book: BookRequiredProps }>()
)

// [Book Page] Update a Book
//  - BookRequiredProos
//  - ID of the book being edited
export const updateBook = createAction(
    '[Books Page] Update book',
    props<{ bookId: string, changes: BookRequiredProps  }>()
)

// [Book Page] Delete a Book
//  - ID of the book being deleted
export const deleteBook = createAction(
    '[Books Page] Delete Book',
    props<{ bookId: string }>()
)

// [Book Page] Cancel editing
export const cancelEditing = createAction(
    '[Books Page] Cancel editing'
)

