import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../model/instructor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  constructor(private http:HttpClient) { }

  public findAllInstructors(): Observable<Array<Instructor>>{
  return this.http.get<Array<Instructor>>(environment.backendHost +"/instructor/all")
  }
}
