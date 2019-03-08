import { DatePipe } from '@angular/common';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from '../model/task';
import {ParentTask} from '../model/parentTask';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http: HttpClient;
  taskHttpUrl: string = environment.apiUrl + '/tasks/';
  ptaskHttpUrl: string = environment.apiUrl + '/ptasks/';

  constructor(http: HttpClient, private datePipe: DatePipe) {
    this.http = http;
  }

  getAllParentTasks(): Promise<any> {
    return this.http.get<ParentTask>(this.ptaskHttpUrl).toPromise().then(value => value);
  }

  getAllTasks(): Promise<any> {
    return this.http.get<Task>(this.taskHttpUrl).toPromise().then(value => value);
  }

  getTask(id: string): Promise<any> {
    return this.http.get(this.taskHttpUrl + '' + id).toPromise().then(value => value);
  }

  getTaskByProject(id: number): Promise<any> {
    return this.http.get<Task>(this.taskHttpUrl + 'projects/' + '' + id).toPromise().then(value => value);
  }

  addTask(t: Task): Promise<any> {
    return this.http.post(this.taskHttpUrl, t).toPromise().then(value => value);
  }

  addParentTask(t: ParentTask): Promise<any> {
    return this.http.post(this.ptaskHttpUrl, t).toPromise().then(value => value);
  }

  updateTask(id: number, t: Task): Promise<any> {
    return this.http.put(this.taskHttpUrl, t).toPromise().then(value => value);
  }

  deleteTask(id: number, t: Task): Promise<any> {
    return this.http.delete(this.taskHttpUrl + '' + id).toPromise().then(value => value);
  }
}
