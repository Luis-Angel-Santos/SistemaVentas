import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlAPI: string = environment.endpoint + 'Dashboard';

  constructor(private http: HttpClient) { }

  //obtener todos los productos
  resumen():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Resumen`);
  }
}
