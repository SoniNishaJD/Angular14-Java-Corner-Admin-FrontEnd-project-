import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { Student } from 'src/app/model/student.model';
import { StudentsService } from 'src/app/services/students.service';
import { UsersService } from 'src/app/services/users.service';
import { EmailExistsValidator } from 'src/app/validators/emailexists.validator';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})


export class StudentsComponent implements OnInit {


  searchFormGroup!: FormGroup;
  studentFormGroup!: FormGroup;
  updatestudentFormGroup!: FormGroup;
  pageStudents!: Observable<PageResponse<Student>>;
  errorMessage!: string;
  users$!: Observable<Array<User>>
  currentPage: number = 0;
  pageSize: number = 3;
  submitted: boolean = false;
  updateStudentFormGroup: any;

  errorUsersMessage!: string;
  defaultUser: any;
  updateContent: any;
  UserService: any;


  // constructor() { }
  constructor(private modalService: NgbModal, private studentService: StudentsService, private fb: FormBuilder, private userService: UsersService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    });
    this.studentFormGroup = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      level: ["", Validators.required],
      user: this.fb.group({ 
        email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")], [EmailExistsValidator.validate(this.userService)]],
        password: ["", Validators.required],
      })
    })

    this.handleSearchStudents();
  }


  getModal(content: any) {
    this.modalService.open(content, { size: 'xl' })
    this.fatchUsers();
    this.submitted = false
  }


  handleSearchStudents() {
    let keyword = this.searchFormGroup.value.keyword;
    console.log(this.pageStudents)
    this.pageStudents = this.studentService.searchStudent(keyword, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )

  }

  handleDeleteStudent(s: Student) {
    let conf = confirm("Are you sure?");
    if (!conf) return;
    this.studentService.deleteStudent(s.studentId).subscribe({
      next: () => {
        this.handleSearchStudents()
      },
      error: err => {
        alert(err.message)
        console.log(err);
      }
    })
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchStudents();

  }

  onSaveStudent(modal: any) {
    this.submitted = true;
    if (this.studentFormGroup.invalid) return;
    this.studentService.saveStudent(this.studentFormGroup.value).subscribe({
      next: () => {
        alert("success Saving Student");
        this.handleSearchStudents();
        this.studentFormGroup.reset();
        this.submitted = false;
        modal.close();
      }, error: err => {
        alert(err.message)
      }
    })

  }
  

  onCloseModel(modal: any) {
    modal.close();
    this.studentFormGroup.reset();
}

  getUpdateModel(s: Student, updateContent: any) {
    this.fatchUsers();
    this.updateStudentFormGroup = this.fb.group({
      studentId: [s.studentId, Validators.required],
      firstName: [s.firstName, Validators.required],
      lastName: [s.lastName, Validators.required],
      level: [s.level, Validators.required],
      email: [s.email, Validators.required],
      password: [s.password, Validators.required],
      user: [s.user, Validators.required],
      instructor: [s.instructor, Validators.required]
    })
    this.defaultUser = this.updateStudentFormGroup.controls['user'].value;
    this.modalService.open(updateContent, {size: 'xl' })
  }

  fatchUsers() {
    this.users$ = this.UserService.findAllUsers().pipe(
      catchError(err => {
        this.errorUsersMessage = err.message;
        return throwError(err);
      })
    )
  }
  onCloseModal(modal: any) {
    modal.close();
    this.studentFormGroup.reset();
}
  onUpdateStudent(updateModel: any) {
    this.submitted = true;
    if (this.updateStudentFormGroup.invalid) return;
    this.studentService.updateStudent(this.updateStudentFormGroup.value, this.updateStudentFormGroup.value.studentId).subscribe({
      next: () => {
        alert("success Updating Student");
        this.handleSearchStudents();
        this.submitted = false; 
        updateModel.close();
      }, error: err => {
        alert(err.message)
      }
    })
}


}

 