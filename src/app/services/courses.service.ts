import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PageResponse } from '../model/page.response.model';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http:HttpClient) { }

  public searchCourses(keyword:string, currentPage: number, pageSize: number): Observable<PageResponse<Course>>{
  return this.http.get<PageResponse<Course>>(environment.backendHost+"/courses?keyword="+keyword+"&page=" +currentPage +" &size=" +pageSize);
}

  public deleteCourse(courseId: number){
    return this.http.delete(environment.backendHost +"/courses/"+ courseId)
  }

  public saveCourse(course: Course): Observable<Course>{
    return this.http.post<Course>(environment.backendHost +"/courses/", course)
  }
}