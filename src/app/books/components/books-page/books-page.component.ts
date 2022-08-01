import { Component, OnInit } from "@angular/core";
import {
  BookModel,
  calculateBooksGrossEarnings,
  BookRequiredProps
} from "src/app/shared/models";
import { BooksService } from "src/app/shared/services";
import {Store} from "@ngrx/store";
import {BooksApiActions, BooksPageActions} from "../../actions";
import {Observable} from "rxjs";
import {selectAllBooks, selectBooksEarningTotal, selectActiveBook} from "../../../shared/state";

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books: BookModel[] = [];
  total$: Observable<number>;
  books$: Observable<BookModel[] | null>;
  currentBook$: Observable<BookModel>;

  constructor(
    private booksService: BooksService,
    private store: Store
  ) {
    // @ts-ignore
    this.total$ = store.select(selectBooksEarningTotal);
    // @ts-ignore
    this.books$ = store.select(selectAllBooks);
    // @ts-ignore
    this.currentBook$ = store.select(selectActiveBook);
  }

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enter())
    this.removeSelectedBook();
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({ bookId: book.id }));
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.booksService.create(bookProps).subscribe(book => {
      this.store.dispatch(BooksApiActions.bookCreated({ book }));
      this.removeSelectedBook();
    });
  }

  updateBook(book: BookModel) {
    this.store.dispatch(BooksPageActions.updateBook({ bookId: book.id, changes: book }));

    this.booksService.update(book.id, book).subscribe(() => {
      this.removeSelectedBook();
      this.store.dispatch(BooksApiActions.bookUpdated({ book: book }))
    });
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({ bookId: book.id }));

    this.booksService.delete(book.id).subscribe(() => {
      this.removeSelectedBook();

      this.store.dispatch(BooksApiActions.bookDeleted({ bookId: book.id }))
    });
  }
}
