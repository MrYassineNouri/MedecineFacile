import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { course } from '../course';
import { CourseService } from '../course.service';
import { MatDialog } from '@angular/material/dialog';
import { AppContactDialogContentComponent } from '../../contact/contact.component';

<<<<<<< HEAD

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],

=======
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
})
export class AppCourseDetailComponent implements OnInit {
  specialityId!: string;
  courses: course[] = [];
<<<<<<< HEAD
  speciality: import("../speciality").speciality[];
=======
  speciality: import("c:/Users/pc_MSI/Downloads/frontMedcine-main/frontMedcine-main/src/app/pages/apps/courses/speciality").speciality[];
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
  selectedSpecialityId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  this.courseService.getSpecialities().subscribe({
    next: (specialities) => {
      this.speciality = specialities;
      console.log('Loaded specialities:', specialities); // Add this
      // Use route param if exists, otherwise first speciality
      this.selectedSpecialityId = this.selectedSpecialityId || (specialities.length > 0 ? specialities[0]._id : undefined);
<<<<<<< HEAD
      /*console.log('Set selectedSpecialityId to:', this.selectedSpecialityId); // Add this*/
=======
      console.log('Set selectedSpecialityId to:', this.selectedSpecialityId); // Add this
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22

      if (this.selectedSpecialityId) {
        this.loadCourses();
      }
    },
    error: (err) => console.error('Failed to load specialities', err)
  });
}


<<<<<<< HEAD

=======
 loadCourses(): void {
    // Make sure you have selectedSpecialityId defined somewhere
    if (!this.selectedSpecialityId) {
      console.error('No speciality selected');
      return;
    }

    // Call the service method to get courses for this speciality
    this.courseService.getCoursesBySpeciality(this.selectedSpecialityId).subscribe({
      next: (courses) => {
        this.courses = courses; // store courses to display
      },
      error: (err) => console.error('Failed to load courses', err)
    });
  }
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22



  goBack(): void {
    this.router.navigate(['/apps/courses']);
  }

<<<<<<< HEAD
  openPDF(course: course): void {
    if (!course._id) return;
    this.courseService.openPdf(course._id).subscribe({
=======
  /*
  openPDF(course: course): void {
    if (!course._id) return;
    this.courseService.downloadPdf(course._id).subscribe({
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
      next: (pdfBlob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL);
      },
      error: (err) => console.error('Failed to open PDF', err)
    });
<<<<<<< HEAD
  }

  openDialog(action: string): void {
    /*console.log('Selected speciality ID:', this.selectedSpecialityId);*/
=======
  }*/

  openDialog(action: string): void {
    console.log('Selected speciality ID:', this.selectedSpecialityId);
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      data: { 
        action, 
        speciality: this.selectedSpecialityId // Pass the speciality ID
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'AddCourse') {
        const formData: FormData = new FormData();
        formData.append('title', result.data.name);
        formData.append('description', result.data.description || '');
        formData.append('speciality', this.selectedSpecialityId); // Use the correct ID
        formData.append('pdf', result.data.file); // Match backend expectation
        // Debug: Check what's in the FormData
<<<<<<< HEAD
        /*console.log('FormData contents:');*/
        formData.forEach((value, key) => {
          /*console.log(key, value);*/
        });
        // Simple field checking
        /*
=======
        console.log('FormData contents:');
        formData.forEach((value, key) => {
          console.log(key, value);
        });
        // Simple field checking
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
        const fields = ['title', 'description', 'speciality', 'pdf'];
        console.log('FormData contents:');
        fields.forEach(field => {
          const value = formData.get(field);
          console.log(`${field}:`, value);
          
          if (field === 'pdf' && value instanceof File) {
            console.log('PDF File details:', value.name, value.size, value.type);
          }
        });
<<<<<<< HEAD
*/
=======

>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
        this.courseService.addCourse(formData).subscribe({
          next: (savedCourse) => {
            this.courses.unshift(savedCourse);
            console.log('Course added successfully', savedCourse);
          },
          error: (err) => console.error('Failed to add course', err)
        });
      }
    });
  }

<<<<<<< HEAD
  loadCourses() {
  if (!this.selectedSpecialityId) return;

  this.courseService.getCoursesBySpeciality(this.selectedSpecialityId).subscribe({
    next: (courses) => this.courses = courses,
    error: (err) => console.error('Failed to load courses', err)
  });
}

  deleteCourse(course: course): void {
    if (!course._id) return;

    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      this.courseService.deleteCourse(course._id).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== course._id);
          console.log(`Course "${course.title}" deleted`);
        },
        error: (err) => console.error('Failed to delete course', err)
      });
    }
  }
=======
/*
  deleteCourse(course: course): void {
    if (!course._id) return;
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      this.courseService.deleteCourse(course._id).subscribe({
        next: () => this.courses = this.courses.filter(c => c._id !== course._id),
        error: (err) => console.error('Failed to delete course', err)
      });
    }
  }*/
>>>>>>> 9ece8ba5b8089bc7a8d4a00a73c1f838c89c4b22
}
