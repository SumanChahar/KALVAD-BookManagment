import { Component, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/core/models/book';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './book-form-dialog.component.html',
  styleUrls: ['./book-form-dialog.component.scss']
})
export class BookFormDialogComponent {
  formInstance: FormGroup;
  minYear  = 1000;
  maxYear  = 2022;

  constructor(public dialogRef: MatDialogRef<BookFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book) {
    this.formInstance = new FormGroup({
      "id":  new FormControl('', Validators.required),
      "title": new FormControl('', Validators.required),
      "year": new FormControl('', [Validators.required,Validators.min(this.minYear),Validators.max(this.maxYear)]),
      "author": new FormControl('', Validators.required),
    });

    this.formInstance.setValue(data);
  }

  save(): void {
    this.dialogRef.close(Object.assign(new Book(), this.formInstance.value));
  }
}
