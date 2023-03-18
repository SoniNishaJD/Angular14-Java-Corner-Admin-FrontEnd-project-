import {User} from "./user.model";

export interface Student {
  email: any;
  password: any;
  instructor: any;
  studentId:number;
  firstName:string;
  lastName:string;
  level:string;
  user:User;
}
