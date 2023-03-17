import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { error } from 'jquery';
import { Observable, catchError, throwError } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { CoursesService } from 'src/app/services/courses.service';
import { InstructorsService } from 'src/app/services/instructors.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {


  searchFormGroup!:FormGroup
  courseFormGroup!: FormGroup
  pageCourses$! :Observable<PageResponse<Course>>
  instructors$!: Observable<Array<Instructor>>
  currentPage: number=0;
  pageSize: number=5;
  errorMessage!: string;
  errorInstructorsMessage!: string;
  submitted: boolean = false;
  constructor(private modalService: NgbModal, private fb: FormBuilder, private courseService : CoursesService, private instructorService: InstructorsService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.courseFormGroup = this.fb.group({
      courseName: ["", Validators.required],
      courseDuration: ["", Validators.required],
      courseDescription: ["", Validators.required],
      instructor: [null, Validators.required]
    })
    this.handleSearchCourses()
  }


  getModal(content: any) {
    this.submitted = false;
    this.fatchInstructors();
    this.modalService.open(content, {size: 'xl'})
    
  }

  handleSearchCourses() {
   let keyword = this.searchFormGroup.value.keyword;
   this.pageCourses$ = this.courseService.searchCourses(keyword,this.currentPage,this.pageSize).pipe(
    catchError(err =>{
      this.errorMessage = err.message;
      return throwError(err);
    })
   )
    }
    goToPage(page: number){
  this.currentPage = page;
  this.handleSearchCourses();

}

handleDeleteCourse(c: Course){
  let conf = confirm("Are You Sure?")
  if(!conf) return;
  this.courseService.deleteCourse(c.courseId).subscribe({
    next:()=>{
      this.handleSearchCourses();
    },
    error:err =>{
      alert(err.message)
      console.log(err)
    }
  })
}
fatchInstructors(){
this.instructors$ = this.instructorService.findAllInstructors().pipe(
  catchError(err => {
    this.errorInstructorsMessage = err.message;
    return throwError(err);
  })
)
}
  onCloseModel() {
    modal.close();
    this.courseFormGroup.reset();
}
  onSaveCourse() {
    this.submitted = true;
    console.log(this.courseFormGroup)
    if (this.courseFormGroup.invalid) return;
    this.courseService.saveCourse(this.courseFormGroup.value).subscribe({
      next: () => {
        alert("success Saving Course");
        this.handleSearchCourses();
        this.courseFormGroup.reset();
        this.submitted = false;
        modal.close()
      }, error: err =>{
        alert(err.message);
      }
    })
   
  }
  getUpdateModel(c: Course, updateContent: any) {
    
  }
}
