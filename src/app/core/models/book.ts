export class Book {
  id?: number;
  title: string;
  year: number;
  author: string;

  constructor(id = 0, title = '', year = 0, author = '') {
    this.id = id;
    this.title = title;
    this.year = year;
    this.author = author;
  }
}

