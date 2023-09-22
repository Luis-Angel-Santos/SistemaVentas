import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlAPI: string = environment.endpoint + 'Menu/';

  constructor(private http: HttpClient) { }

  /**
   * Obtener menus por usuario
   * @param idUsuario
   * @returns
   */
  lista(idUsuario: number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista?idUsuario=${idUsuario}`);
  }
}
