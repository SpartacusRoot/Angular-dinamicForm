import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Regioni, Districs } from '../models/italia.model';
import { map,  find, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ItaliaDateService {
province: any;
provincia: any;

  constructor(private http: HttpClient) { }
  getRegion() {
    return this.http.get<Regioni>('../../assets/mock/regioni.json');
  }
  getDistrict(): Observable<any> {
   return this.http.get<Districs>('../../assets/mock/province.json');
  }

  getMunicipality(): Observable<any> {
    return this.http.get('../../assets/mock/comuni.json');
  }
// ritorna le provincie in modo dinamico in base alla selezione della regione
  filterDistrict(val: string): Observable<any[]> {
    return this.getDistrict()
    .pipe(
     map(response => response.filter(res => {
        return res.id_regione === val;
      })),
    );
  }
// return
filterMunicipality(val: string): Observable<any[]> {
  return this.getMunicipality()
  .pipe(
   map(response => response.filter(res => {
      return res.id_regione === val;
    })),
  );
}

}

