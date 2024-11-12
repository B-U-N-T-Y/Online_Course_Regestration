import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from './student';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private createUrl = 'http://localhost:8089/student/addStudent';
  private updateUrl = 'http://localhost:8089/student/updateStudent';
  private detailsUrl = 'http://localhost:8089/student/getStudentById';
  private loginUrl = 'http://localhost:8089/student/getaccesstoken';
  private deleteUrl = 'http://localhost:8089/student/deleteStudent';
  private allDepartmentsUrl = 'http://localhost:8089/student/allDepartments';
  private allCoursesUrl = 'http://localhost:8089/student/allCourses';
  private coursesByDepartmentUrl = 'http://localhost:8089/student/coursesByDepartment';
  private priceByCourseUrl = 'http://localhost:8089/student/priceByCourse';

  constructor(private http: HttpClient) { }

  createStudent(student: Student): Observable<Object> {

    return this.http.post(`${this.createUrl}`, student)
  }

  updateStudent(value: any): Observable<Object> {

    return this.http.put(`${this.updateUrl}`, value);
  }
  deleteStudent(userId:number,department:String, course:String): Observable<Object> {
    return this.http.delete(`${this.deleteUrl}/${userId}/${department}/${course}`);
  }
  studentDetails(userId:number,department:String, course:String): Observable<any> {

    return this.http.get(`${this.detailsUrl}/${userId}/${department}/${course}`);
  }
  login(user: User): Observable<any> {
    return this.http.post(`${this.loginUrl}`, user);
  }

  allDepartments(): Observable<any> {

    return this.http.get(`${this.allDepartmentsUrl}`);
  }
  allCourses(): Observable<any> {

    return this.http.get(`${this.allCoursesUrl}`);
  }

  coursesByDepartment(department:String): Observable<any> {

    return this.http.get(`${this.coursesByDepartmentUrl}/${department}`);
  }

  priceByCourse(course:String): Observable<any> {

    return this.http.get(`${this.priceByCourseUrl}/${course}`);
  }




}
