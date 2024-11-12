import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.css']
})
export class StudentUpdateComponent implements OnInit {

  userId: number;
  department: String;
  course: String
  student: Student;
  errorMessages: any = {};

  constructor(private route: ActivatedRoute,private router: Router,
    private studentService: StudentService,
    private toastr : ToastrService) { }
  ngOnInit(): void {

    if (localStorage.getItem("check")== "yes") {

      this.student= new Student();
      this.userId= this.route.snapshot.params['userId'];
      this.department= this.route.snapshot.params['department'];
      this.course= this.route.snapshot.params['course'];

      const userUserId = document.getElementById('userId');
      const userDepartment = document.getElementById('department');
      const userCourse = document.getElementById('course');

      if(userUserId){
        userUserId.style.pointerEvents = 'none';
      }
  
      if(userDepartment){
        userDepartment.style.pointerEvents = 'none';
      }
      if(userCourse){
        userCourse.style.pointerEvents = 'none';
      }

      this.studentService.studentDetails(this.userId,this.department,this.course).subscribe(data => {
        console.log(data)
        this.student = data;
        console.log(this.student);
  
      }, error => console.log(error));

    }else{
      this.router.navigate(['student-list']);
    }

  }

  updateStudentComponent(){
    this.studentService.updateStudent(this.student)
    .subscribe(
      (data: any) => {
      console.log(data);
      this.student = new Student();
      this.toastr.success("Record Updated Successful");
      this.gotoList();
    },
    (error: HttpErrorResponse)=>{
      if (error.status === 400){
        this.toastr.warning("Enter all the necessary fields.")
        this.handleValidationErrors(error.error.errors);
        console.log(error);
      } else{
        console.error("An unexpected error occured : ", error);
        this.toastr.error("failed to update student due to Unexpected Error.");
      }
    } 
  );
  }

  onSubmit() {
    this.updateStudentComponent();    
  }

  gotoList() {
    this.router.navigate(['/student-list']);
  }

  // handleValidationErrors(errors: string[]){
  //   this.errorMessages= {};
  //   errors.forEach((error)=>{
  //     if(error.includes("UserId")){
  //       this.errorMessages.userId = error;
  //     }
  //     if(error.includes("Department")){
  //       this.errorMessages.department = error;
  //     }
  //     if(error.includes("Course")){
  //       this.errorMessages.course = error;
  //     }
  //     if(error.includes("Name")){
  //       this.errorMessages.name = error;
  //     }
  //     if(error.includes("Gender")){
  //       this.errorMessages.gender = error;
  //     }
  //     if(error.includes("Email")){
  //       this.errorMessages.email = error;
  //     }
  //     if(error.includes("Mobile")){
  //       this.errorMessages.mobileNo = error;
  //     }
  //     if(error.includes("Regestration")){
  //       this.errorMessages.regestrationDate = error;
  //     }
      
  //   }

  //   );

  // }

  handleValidationErrors(errors: string[]): void {
    this.errorMessages = {};  // Reset the errorMessages object
  
    // Map of field names to match error message substrings
    const fieldMap: { [key: string]: string } = {
      userId: 'UserId',
      department: 'Department',
      course: 'Course',
      name: 'Name',
      gender: 'Gender',
      email: 'Email',
      mobileNo: 'Mobile',
      regestrationDate: 'Regestration',
    };
  
    // Loop through each error and assign it to the corresponding field
    errors.forEach((error) => {
      Object.keys(fieldMap).forEach((field) => {
        if (error.includes(fieldMap[field])) {
          this.errorMessages[field] = error;
        }
      });
    });
  }
  

}
