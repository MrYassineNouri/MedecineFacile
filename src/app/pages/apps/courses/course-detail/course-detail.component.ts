import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { course } from '../course';
import { CourseService } from '../course.service';
import { MatDialog } from '@angular/material/dialog';
import { AppContactDialogContentComponent } from '../../contact/contact.component';


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],

})
export class AppCourseDetailComponent implements OnInit {
  specialityId!: string;
  courses: course[] = [];
  filteredCourses: course[];
  speciality: import("../speciality").speciality[];
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
      /*console.log('Set selectedSpecialityId to:', this.selectedSpecialityId); // Add this*/

      if (this.selectedSpecialityId) {
        this.loadCourses();
      }
    },
    error: (err) => console.error('Failed to load specialities', err)
  });
}

loadCourses() {
  if (!this.selectedSpecialityId) return;

  this.courseService.getCoursesBySpeciality(this.selectedSpecialityId).subscribe({
    next: (courses) => {
      this.courses = courses;
      this.filteredCourses = [...this.courses]; // ✅ initialize filteredCourses
    },
    error: (err) => console.error('Failed to load courses', err)
  });
}



  goBack(): void {
    this.router.navigate(['/apps/courses']);
  }

openPDF(course: course): void {
  this.courseService.openPdf(course).subscribe({
    next: (pdfBlob) => {
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL);
    },
    error: (err) => {
      console.error('Failed to open PDF', err);
      alert('Failed to open PDF. Please try again later.');
    }
  });
}

downloadPDF(course: course): void {
  this.courseService.downloadPdf(course).subscribe({
    next: (pdfBlob) => {
      // Create a temporary link element
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;

      // Set filename (course title with .pdf)
      link.download = `${course.title}.pdf`;

      // Trigger download
      link.click();

      // Clean up URL object
      URL.revokeObjectURL(blobUrl);
    },
    error: (err) => {
      console.error('Failed to download PDF', err);
      alert('Failed to download PDF. Please try again later.');
    }
  });
}

 applyCourseFilter(event: Event): void {
  const value = (event.target as HTMLInputElement).value?.trim().toLowerCase();
  if (!value) {
    this.filteredCourses = [...this.courses];
  } else {
    this.filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(value)
    );
  }
}

  openDialog(action: string): void {
    /*console.log('Selected speciality ID:', this.selectedSpecialityId);*/
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
        /*console.log('FormData contents:');*/
        formData.forEach((value, key) => {
          /*console.log(key, value);*/
        });
        // Simple field checking
        /*
        const fields = ['title', 'description', 'speciality', 'pdf'];
        console.log('FormData contents:');
        fields.forEach(field => {
          const value = formData.get(field);
          console.log(`${field}:`, value);
          
          if (field === 'pdf' && value instanceof File) {
            console.log('PDF File details:', value.name, value.size, value.type);
          }
        });
*/
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



  addCourse(): void {
  const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
    data: { action: 'AddCourse' }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result?.event === 'AddCourse') {
      const formData: FormData = new FormData();
      formData.append('title', result.data.name);
      formData.append('description', result.data.description || '');
      formData.append('speciality', this.selectedSpecialityId); // required by backend
      formData.append('pdf', result.data.file); // PDF file from dialog

      this.courseService.addCourse(formData).subscribe({
        next: (savedCourse) => {
          this.courses.unshift(savedCourse);
          this.filteredCourses = [...this.courses]; // refresh UI
          console.log('Course added successfully:', savedCourse);
        },
        error: (err) => console.error('Failed to add course', err)
      });
    }
  });
}


  deleteCourse(course: course): void {
  if (!course._id) return;

  if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
    // Optimistic update: remove immediately
    const previousCourses = [...this.courses];
    this.courses = this.courses.filter(c => c._id !== course._id);
    this.filteredCourses = [...this.courses]; // keep filtered list in sync

    this.courseService.deleteCourse(course._id).subscribe({
      next: () => {
        console.log(`Course "${course.title}" deleted`);
      },
      error: (err) => {
        console.error('Failed to delete course', err);
        // rollback if API failed
        this.courses = previousCourses;
        this.filteredCourses = [...this.courses];
      }
    });
  }
}

}
