import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { speciality } from './speciality';
import { course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/api';  // backend URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // token from login
    console.log(localStorage.getItem('token'));
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all specialities
  getSpecialities(): Observable<speciality[]> {
     return this.http.get<speciality[]>(`${this.apiUrl}/speciality`);
  }

  // Add a speciality (admin only)
  addSpeciality(newSpec: speciality): Observable<speciality> {
    return this.http.post<speciality>(
      `${this.apiUrl}/speciality`,
      newSpec,
      { headers: this.getAuthHeaders() }
    );
  }

   // Get all courses by speciality
  getCoursesBySpeciality(specialityId: string): Observable<course[]> {
    return this.http.get<course[]>(`${this.apiUrl}/courses/speciality/${specialityId}`);
  }

  //Add course 
  addCourse(formData: FormData): Observable<course> {
    return this.http.post<course>(
      `${this.apiUrl}/courses`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    );
  }

  //delete course
   deleteCourse(courseId: string): Observable<void> {
  const headers = this.getAuthHeaders();
  console.log('DELETE headers:', headers.keys(), headers.get('Authorization'));
  return this.http.delete<void>(`${this.apiUrl}/courses/${courseId}`, { headers });
}

  //open pdf
  openPdf(courseId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${courseId}`, { responseType: 'blob' });
  }
}
