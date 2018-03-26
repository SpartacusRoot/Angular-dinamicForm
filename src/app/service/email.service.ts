import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class EmailService {
  private url = 'http://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

 checkEmail(email: string) {
   return this.http.get<any>(this.url)
   .pipe(
    map(response => response.filter(res => {
       return res.email === email ;
     })),
   );
 }
}
