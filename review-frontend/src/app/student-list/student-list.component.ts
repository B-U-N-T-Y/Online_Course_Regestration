import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  selectedStudent: any = null;
  disabled = true;
  searchName:string;
  searchCourse:string = '';
  searchStart : Date;
  searchEnd : Date;
  validId : any;
  allCourses: any[] = [];

  constructor(private router: Router, private studentservice: StudentService, private http: HttpClient, private toastr : ToastrService, private jwtservice : JwtHelperService) { }
  ngOnInit(): void {

    localStorage.setItem("check","no");

    this.initializeDataTable();
    this.studentservice.allCourses().subscribe(
      (data: any) =>{
        console.log(data);
        this.allCourses=data;
      },
      (error) => {
        console.error("Error in finding all Courses :", error);
      }
    );

    this.validId = setInterval(()=>{
      if((localStorage.getItem("accesstoken")!=null) && (this.jwtservice.isTokenExpired(localStorage.getItem("accesstoken"))))  {
        alert("Session Expired.");
        localStorage.removeItem("accesstoken");
        this.router.navigateByUrl('student-login');
      }
    },500)
  }

  ngOnDestroy(){
    clearInterval(this.validId);
  }

  showDateFields = false;
  toggleDropDown() {
    this.showDateFields = !this.showDateFields;
  }
  createStudent() {
    this.router.navigate([`student-create`]);
  }

  logout(){
    localStorage.removeItem("accesstoken");
    this.router.navigate(['student-login']);
    this.toastr.success("LogOut Successfully")
  }

  searching(){
    const table= $('#myTable').DataTable();
    table.ajax.reload();
  }
  onCancel(){
    this.searchName = '';
    this.searchCourse = '';
    this.searchStart = null;
    this.searchEnd = null;
    this.getStudent();
  }

  onClick(student: any) {
    this.selectedStudent = student;
    this.disabled = false;
  }

  private getStudent() {
    $('#myTable').DataTable().destroy();
    this.initializeDataTable();
  }

  initializeDataTable() {
    const table = $('#myTable').DataTable({
      serverSide: true,
      processing: false,
      searching: false,
      ordering: false,
      lengthMenu: [5, 10, 15, 20, 25],

      ajax: (data: any, callback: any) => {
        this.http.get('http://localhost:8089/student/search', {
          params: {
            iDisplayStart: (data.start / data.length).toString(),
            iDisplayLength: data.length.toString(),
            searchParam: JSON.stringify({ name: this.searchName, course: this.searchCourse, startDate: this.searchStart, endDate: this.searchEnd }) // Pass the search term here
          }

        }).subscribe((response: any) => {
          console.log(response);
          callback({
            draw: data.draw,
            recordsTotal: response.iTotalRecords,
            recordsFiltered: response.iTotalDisplayRecords,
            data: response.aaData,
          });
        });
      },
      columns: [
        { data: 'userId' },
        { data: 'department' },
        { data: 'course' },
        { data: 'name' },
        { data: 'gender' },
        { data: 'email' },
        { data: 'mobileNo' },
        { data: 'regestrationDate' },
        { data: 'price' },
        {
          data: "status",
          render: function (data) {
            if (data === "Active") {
              return '<span style="color: green; font-weight: bold;">Active</span>';
            } else if (data === "Deleted") {
              return '<span style="color: red; font-weight: bold;">Deleted</span>';
            } else {
              return data;
            }
          },
        }
      ],
      rowCallback: (row: Node, data: any) => {
        $(row).off('click').on('click', () => {
          if ($(row).hasClass('selected')) {
            $(row).removeClass("selected");
            this.selectedStudent = null;
          } else {
            $("#myTable tr.selected").removeClass("selected");
 
            $(row).addClass('selected');
            this.selectedStudent = data;
          }
          this.onClick(this.selectedStudent);
        });
      } 
    });

  }

  deleteStudent() {


    if(this.selectedStudent == undefined){
      this.toastr.warning("Select a Student");
    }
    if (this.selectedStudent) {
      if (this.selectedStudent.status === "Deleted") {
        this.toastr.warning("This Student has already been deleted.")
        return;
      }
      const confirmed = window.confirm(
        "Are you sure you want to delete the selected Student?"
      );
      if (confirmed) {
        console.log(this.selectedStudent);
        this.studentservice
          .deleteStudent(this.selectedStudent.userId, this.selectedStudent.department, this.selectedStudent.course)
          .subscribe(
            () => {
              this.getStudent();
              this.toastr.success("Student status updated to deleted.")
            },
            (error) => {
              console.error("Error updating employee:", error);
              this.toastr.error("Failed to update Student status.")
            }
          );
      }
    }
  }

  updateStudent() {
    if(this.selectedStudent == undefined){
      this.toastr.warning("Select a Student");
    }
    else if (this.selectedStudent.status === "Deleted") {
      this.toastr.warning("This Student has already been deleted.");
    }else{
      localStorage.setItem("check","yes");
    this.router.navigate([`student-update`, this.selectedStudent.userId, this.selectedStudent.department, this.selectedStudent.course]);
    }
    
  }
}
