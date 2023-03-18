import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../model/instructor.model';
import { environment } from 'src/environments/environment';
import { PageResponse } from '../model/page.response.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {
  
  

  constructor(private http: HttpClient) { }
  public searchInstructors(keyword: string, currentPage: number, pageSize: number): Observable<PageResponse<Instructor>>{
    return this.http.get<PageResponse<Instructor>>(environment.backendHost + "/instructor?keyword=" + keyword + "&page=" + currentPage + "&size=" + pageSize);
  }

  public findAllInstructors(): Observable<Array<Instructor>>{
  return this.http.get<Array<Instructor>>(environment.backendHost +"/instructor/all")
  }

  public deleteInstructor(instructorId: number) {
    return this.http.delete(environment.backendHost+"/instructor/"+ instructorId)
  }

  public saveInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(environment.backendHost + "/instructor", instructor);
  }
    
  
}
