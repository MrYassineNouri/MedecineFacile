import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';
import { speciality } from './speciality';
import { MatDialog } from '@angular/material/dialog';
import { AppContactDialogContentComponent } from '../contact/contact.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class AppCoursesComponent implements OnInit {
  specialities: speciality[] = [];
  filteredSpecialities: speciality[] = [];

  constructor(public dialog: MatDialog, private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadSpecialities();
  }

<<<<<<< HEAD
  
/*load = getall?*/
=======
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
  loadSpecialities(): void {
    this.courseService.getSpecialities().subscribe({
      next: (data) => {
        this.specialities = data;
        this.filteredSpecialities = [...this.specialities];
      },
      error: (err) => console.error(err)
    });
  }

  openDialog(action: string): void {
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      data: { action }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'AddSpeciality') {
        const newSpec: speciality = { 
          title: result.data.name,              // from dialog form
          description: result.data.description 
        };

        this.courseService.addSpeciality(newSpec).subscribe({
          next: () => this.loadSpecialities(), // reload after adding
          error: (err) => console.error('Failed to add speciality', err)
        });
      }
    });
  }


  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value?.trim().toLowerCase();
    if (!value) {
      this.filteredSpecialities = [...this.specialities];
    } else {
      this.filteredSpecialities = this.specialities.filter(spec =>
        spec.title.toLowerCase().includes(value)
      );
    }
  }
}
