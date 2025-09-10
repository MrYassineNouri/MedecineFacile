import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();

  constructor(private http: HttpClient,private settings: CoreService, private router: Router) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      this.http.post<any>('http://localhost:5000/api/auth/login', this.form.value)
        .subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token); // store JWT
            this.router.navigate(['/dashboards/dashboard1']);
          },
          error: (err) => {
            console.error(err);
            alert(err.error.message || 'Login failed');
          }
        });
    }
  }
}
