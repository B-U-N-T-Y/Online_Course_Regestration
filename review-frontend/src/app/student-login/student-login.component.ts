import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  user : User = new User();

  constructor(private route : ActivatedRoute, private studentService : StudentService, private router: Router, private toastr : ToastrService) { }

  ngOnInit(): void {
    localStorage.clear();
  }

  ValidationUser: String='';
  ValidationPassword: String='';
  
  isPasswordVisible = false;
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(){
    this.studentService.login(this.user).subscribe(data=>{
      if(data.code=="NULLCOD"){

        this.toastr.error("Empty username and password","**Login Failed**");
      }
      else if(data.code === "FAILED"){
        console.log(data.message)
        this.ValidationUser = data.message;
      }else if(data.access_token=="No token"){
        this.ValidationPassword=data.message;
      }
      else{
        localStorage.setItem("accesstoken",data.details[0].access_token);
        this.router.navigate(['student-list']);
        this.toastr.success("Login Successful");
      }
    })
  }
  removeVal(){
    this.ValidationUser='';
    this.ValidationPassword='';
  }
}
