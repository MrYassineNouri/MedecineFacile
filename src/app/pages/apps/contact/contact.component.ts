import { Component, OnInit, Inject, Optional } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Contact } from './contact';
import { ContactService } from './contact.service';

export interface ContactData {
  closeResult: string;
  contacts: Contact[];
  searchText: any;
  txtContactname: string;
  txtContactPost: string;
  txtContactadd: string;
  txtContactno: string;
  txtContactinstagram: string;
  txtContactlinkedin: string;
  txtContactfacebook: string;
}

@Component({
  templateUrl: './contact.component.html',
})
export class AppContactComponent implements OnInit {
  closeResult = '';
  contacts: Contact[] = [];

  searchText: any;
  txtContactname = '';
  txtContactPost = '';
  txtContactadd = '';
  txtContactno = '';
  txtContactinstagram = '';
  txtContactlinkedin = '';
  txtContactfacebook = '';

  constructor(
    public dialog: MatDialog,
    private contactService: ContactService
  ) {
    this.contacts = this.contactService.getContacts();
    //console.log(this.contacts);
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addContact(result.data);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.contacts = this.filter(filterValue);
  }

  filter(v: string): Contact[] {
    return this.contactService
      .getContacts()
      .filter(
        (x) => x.contactname.toLowerCase().indexOf(v.toLowerCase()) !== -1
      );
  }

  ngOnInit(): void {
    // this.contacts = [];
  }

  // tslint:disable-next-line - Disables all
  addContact(row_obj: ContactData): void {
    this.contacts.unshift({
      contactimg: 'assets/images/profile/user-1.jpg',
      contactname: row_obj.txtContactname,
      contactpost: row_obj.txtContactPost,
      contactadd: row_obj.txtContactadd,
      contactno: row_obj.txtContactno,
      contactinstagram: row_obj.txtContactinstagram,
      contactlinkedin: row_obj.txtContactlinkedin,
      contactfacebook: row_obj.txtContactfacebook,
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppContactDialogContentComponent {
  action: string;
  local_data: any;
  specialityId: string; // Add this property

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.specialityId = this.local_data.speciality; // Store the speciality ID
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file && file.type === 'application/pdf') {
        this.local_data.file = file;
        /*console.log('File selected:', file.name, file.size, file.type);*/
      } else {
        alert('Please select a valid PDF file.');
        // Reset the file input
        input.value = '';
      }
    }
  }

  doAction(): void {
    // Validation before closing
    if (this.action === 'AddSpeciality') {
      if (!this.local_data.name || !this.local_data.name.trim()) {
        alert('Speciality name is required.');
        return; // Add this return
      }
    }

    if (this.action === 'AddCourse') {
      if (!this.local_data.name || !this.local_data.name.trim()) {
        alert('Course name is required.');
        return; // Add this return
      }
      if (!this.local_data.file) {
        alert('PDF file is required.');
        return; // Add this return
      }
      // For AddCourse action, include the speciality ID in the returned data
      this.local_data.speciality = this.specialityId;
    }

    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
