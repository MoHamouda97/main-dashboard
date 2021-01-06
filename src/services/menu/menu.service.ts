import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import * as headers from './../../settings/headers';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  get(type, username, BranchCode, lang) {
    return this.http.get(`${environment.endPoint}login/GetFormsOrReports?type=${type}&username=${username}&BranchCode=${BranchCode}&lang=${lang}`, {headers: headers.noAuthHeader})
  }
}
