import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

  student: Student = new Student();
  errorMessages: any = {};
  allDepartments: any[] = [];
  selectedCourse: any[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.studentService.allDepartments().subscribe(
      (data: any) => {
        console.log(data);
        this.allDepartments = data;
      },
      (error) => {
        console.error("Error in finding all Departments :", error);
      }
    );
  }

  updateCourses() {
    this.studentService.coursesByDepartment(this.student.department).subscribe(
      (data: any) => {
        console.log(data);
        this.selectedCourse = data;
      },
      (error) => {
        console.error("Error in finding Courses :", error);
      }
    );

  }

  updatePrice() {
    this.studentService.priceByCourse(this.student.course).subscribe(
      (data: any) => {
        console.log(data);
        this.student.price = data;
      },
      (error) => {
        console.error("Error in finding the price :", error);
      }
    );
  }

  saveStudent() {
    this.studentService.createStudent(this.student).subscribe(
      (data: any) => {
        console.log(data.code);

        if (data && data.code === "Failed") {
          this.toastr.error(`Student with  UserId ${this.student.userId} , Department ${this.student.department} and Course ${this.student.course} already exists. Please use a different Course`);

        } else {
          this.toastr.success("Student Created Successfully");
          console.log(data);
          this.goToStudentListList();
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.toastr.warning("Enter all the necessary fields.")
          this.handleValidationErrors(error.error.errors);
          console.log(error);
        } else {
          console.error("An unexpected error occured : ", error);
          this.toastr.error("An unexpected error occured : ");

        }
      }
    );
  }

  goToStudentListList() {
    this.router.navigate([`/student-list`])
  }
  onSubmit() {
    this.saveStudent();
  }

  handleValidationErrors(errors: string[]): void {
    this.errorMessages = {};
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
      errors.forEach((error) => {
      Object.keys(fieldMap).forEach((field) => {
        if (error.includes(fieldMap[field])) {
          this.errorMessages[field] = error;
        }
      });
    });
  } 

}
