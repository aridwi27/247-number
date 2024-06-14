import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  numberForm: FormGroup;
  numberArr: number[] = [];
  medianNumber: number = 0;
  sortNumber: number[] = [];
  randomNumber: number[] = [];
  editIndex: number | null = null;
  editForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.numberForm = this.fb.group({
      number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.min(1),
        ],
      ],
    });

    this.editForm = this.fb.group({
      editNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.min(1),
        ],
      ],
    });
  }

  ngOnInit() {}

  editNumber(index: number): void {
    this.editIndex = index;
    this.editForm.patchValue({ editNumber: this.numberArr[index] });
  }

  saveNumber(): void {
    if (this.editIndex !== null && this.editForm.valid) {
      this.numberArr[this.editIndex] = parseInt(
        this.editForm.value.editNumber,
        10
      );
      this.editIndex = null;
      this.editForm.reset();
      this.updateMedian();
      this.updateSortedNumbers();
      this.updateRandomNumbers();
    }
  }

  cancelEdit(): void {
    this.editIndex = null;
    this.editForm.reset();
  }

  confirmDelete(index: number): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.numberArr.splice(index, 1);
        this.updateMedian();
        this.updateSortedNumbers();
      }
    });
  }

  median(arr: number[]): number {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }

  submitNumber(): void {
    if (this.numberForm.valid) {
      this.numberArr.push(parseInt(this.numberForm.value.number, 10));
      this.numberForm.reset();
      this.updateMedian();
      this.updateSortedNumbers();
      this.updateRandomNumbers();
    }
  }

  updateMedian(): void {
    this.medianNumber = this.median(this.numberArr);
  }

  deleteNumber(index: number): void {
    this.numberArr.splice(index, 1);
    this.updateMedian();
    this.updateSortedNumbers();
    this.updateRandomNumbers();
  }

  updateSortedNumbers(): void {
    this.sortNumber = [...this.numberArr].sort((a, b) => a - b);
  }

  updateRandomNumbers(): void {
    this.randomNumber = this.generateRandomNumbers();
  }

  generateRandomNumbers(): number[] {
    const randomNumbers = [...this.numberArr];
    for (let i = randomNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomNumbers[i], randomNumbers[j]] = [
        randomNumbers[j],
        randomNumbers[i],
      ];
    }
    return randomNumbers;
  }

  get f() {
    return this.numberForm.controls;
  }

  get ef() {
    return this.editForm.controls;
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-confirm.component.html',
})
export class DialogOverviewExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
