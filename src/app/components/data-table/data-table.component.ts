import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs'; 
/*import {DragDropModule} from '@angular/cdk/drag-drop';*/
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { MatPaginator,MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource,MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { BookFormDialogComponent } from '../book-form-dialog/book-form-dialog.component';
import { BookService } from 'src/app/core/services/book.service';
import { Book } from 'src/app/core/models/book';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();
  @ViewChild('table') table?: MatTable<Book> ;

  public displayedColumns: string[] = ['title', 'year', 'author'];
  public columnsToDisplay: string[] = [...this.displayedColumns, 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {title: {contains : 'Dune'}}
   **/
  public columnsFilters : {[key:string] : any }= {};

  public dataSource: MatTableDataSource<Book>;
  private serviceSubscribe: Subscription = new Subscription() ;

  public favBookList : Book[] = [];

  constructor(private bookService: BookService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Book>();
  }


  private filter() {

    this.dataSource.filterPredicate  = (data: Book) => {
      let find = true ;

      for (const columnName  in this.columnsFilters) {

        
        const currentData = "" + data[columnName as keyof typeof data];

        //if there is no filter, jump to next loop, otherwise do the filter.
        if (!this.columnsFilters[columnName]) {
          find = false;
          return find;
        }


        let searchValue = this.columnsFilters[columnName]["contains"];

        if (!!searchValue && currentData.indexOf("" + searchValue) < 0) {
          find = false;
          //exit loop
          return find;
        }

        searchValue = this.columnsFilters[columnName]["equals"];
        if (!!searchValue && currentData != searchValue) {
          find = false;
          //exit loop
          return find;
        }

        searchValue = this.columnsFilters[columnName]["greaterThan"];
        if (!!searchValue && currentData <= searchValue) {
          find = false;
          //exit loop
          return find;
        }

        searchValue = this.columnsFilters[columnName]["lessThan"];
        if (!!searchValue && currentData >= searchValue) {
          find = false;
          //exit loop
          return find;
        }

        searchValue = this.columnsFilters[columnName]["startWith"];

        if (!!searchValue && !currentData.startsWith("" + searchValue)) {
          find = false;
          //exit loop
          return find;
        }

        searchValue = this.columnsFilters[columnName]["endWith"];
        if (!!searchValue && !currentData.endsWith("" + searchValue)) {
          find = false;
          //exit loop
          return find;
        }

      }

      return find;
    };

    this.dataSource.filter  = "";
    this.dataSource.filter = 'activate';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Create a filter for the column name and operate the filter action.
   */
  applyFilter(columnName: string, operationType: string, searchValue: string) {
    this.columnsFilters[columnName] = {};
    this.columnsFilters[columnName][operationType] = searchValue;
    this.filter();
  }

  /**
   * clear all associated filters for column name.
   */
  clearFilter(columnName: string) {
    if (this.columnsFilters[columnName]) {
      delete this.columnsFilters[columnName];
      this.filter();
    }
  }

  drop(event: CdkDragDrop<MatTableDataSource<Book>>) {
    const previousIndex = this.dataSource.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.dataSource.data,previousIndex, event.currentIndex);
    this.dataSource.data = this.dataSource.data.slice();
  }
  
  addRow() {
    const newBook : Book = {"id":0, "title": "", "year":1900, "author":""}
    //this.dataSource = [newRow, ...this.dataSource];
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '400px',
      data: newBook
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.add(result);
      }
    });
  }

  edit(data: Book) {
    const dialogRef = this.dialog.open(BookFormDialogComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.edit(result);
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.remove(id);
        //if book is in fav list remove that also
        if(true==this.findBook(this.favBookList,id)) {
           this.favBookList =this.bookService.removeFromFavList(id);
         }

      }
    });
  }

  findBook(bookList : Book[],id: number): boolean {
     const book =this.favBookList.find(b => {
      return b.id == id
    });

     if(undefined === book) {
        return false;
     }
     return true;
  }

  addToFav(id: number) {
    /*let favBook =this.ffindBookavBookList.find(b => {
      return b.id == id
    });*/
    if(true==this.findBook(this.favBookList,id)) {
       alert("Already is  favourite list");
    }
    else {
        this.favBookList =this.bookService.addToFavList(id);
    }
        
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.bookService.getAll();
    this.serviceSubscribe = this.bookService.books$.subscribe(res => {
      this.dataSource.data = res;
    })
  }

  ngOnDestroy(): void {
    this.serviceSubscribe.unsubscribe();
  }

}
