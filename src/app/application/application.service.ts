import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from './application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  addApp: Application = new Application;

  constructor(private http: HttpClient) {
    this.http = http;  
  }
  
  private baseUrl = `${environment.baseUrl}/application`;

  addApplication(application: Application, token: any): Observable<Application>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post<Application>(`${this.baseUrl}/add`, application, {headers: headers});
  }

  getAllApplications(token: any): Observable<any>{
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.get(`${this.baseUrl}/all`, {headers: headers});
  }
}
