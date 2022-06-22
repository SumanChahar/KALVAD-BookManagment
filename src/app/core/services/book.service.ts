import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { booksData } from '../constants/books-static-data';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  books$: BehaviorSubject<Book[]>;
  books: Array<Book> = [];
  favBookList: Array<Book> = [];
  constructor() {
    this.books$ = new BehaviorSubject<Book[]>([]);
    this.books = booksData;
  }

  getAll() {
    this.books$.next(this.books);
  }

  addToFavList(id : number) {
    const favBook =this.books.find(b => {
      return b.id == id
    });
    if(undefined!==favBook) {
     this.favBookList.push(favBook);
    }
    return this.favBookList;
  }

  removeFromFavList(id : number) {   
    return  this.favBookList.splice(id,1,);
  }

  edit(book: Book) {
    const findElem = this.books.find(b => b.id == book.id);
    if(findElem !== undefined) {
      findElem.title = book.title;
      findElem.year = book.year;
      findElem.author = book.author;

      const findIndex =this.books.indexOf(findElem);
      this.books[findIndex]=findElem;

    }

    this.books$.next(this.books);
  }

  add(book: Book) {
    book.id=Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    
    this.books.splice(0,0,book);

    this.books$.next(this.books);
  }

  remove(id: number) {

    this.books = this.books.filter(b => {
      return b.id != id
    });

    this.books$.next(this.books);
  }

}
