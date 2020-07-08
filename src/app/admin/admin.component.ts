import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  name = new FormControl("", Validators.required);
  email = new FormControl("", Validators.required);
  password = new FormControl("", Validators.required);
  photo = new FormControl("", Validators.required);
  role = new FormControl("", Validators.required);
  imageFile: any;
  data: any;

  constructor(fb: FormBuilder, public httpClient: HttpClient, private router: Router) {
    this.form = fb.group({
      name: this.name,
      email: this.email,
      password: this.password,
      photo: this.photo,
      role: this.role
    });
   }

  ngOnInit(): void {
  }

  addPhoto (fileInput: any) {
    this.imageFile = fileInput.target.files[0];
  }

  makeFileRequest (url: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData()
      const xhr = new XMLHttpRequest()

      formData.append('upload', this.imageFile, `${this.imageFile.name}${Date.now()}`)

      formData.append('data', JSON.stringify(this.form.value))

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response))
          } else {
            reject(xhr.response)
          }
        }
      }
      xhr.open('POST', url, true)
      xhr.send(formData)
    })
  }

  signup () {
    this.makeFileRequest(`${environment.API_URL}/auth/create`).then(
      result => {
        Swal.fire({
          allowEnterKey: true,
          allowEscapeKey: true,
          allowOutsideClick: true,
          icon: 'success',
          title: 'Data Submitted Successfully!'
        }).then(success => {
          this.form.reset();
        })
      },
      error => {
        Swal.fire({
          allowEnterKey: true,
          allowEscapeKey: true,
          allowOutsideClick: true,
          icon: 'error',
          title: 'Failed to submit data'
        }).then(success => {
          this.form.reset();
        })
      }
    )
  }
}
