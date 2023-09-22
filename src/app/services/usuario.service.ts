import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Login } from '../interfaces/login';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlAPI: string = environment.endpoint + 'Usuario/';

  constructor(private http: HttpClient) { }

  /**
   * Validar usuario y contraseña
   * @param request
   * @returns
   */
  iniciarSesion(request: Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}IniciarSesion`, request);
  }

  /**
   * Obtener todos los usuarios
   * @returns
   */
  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`);
  }

  /**
   * Guardar un nuevo usuario
   * @param request
   * @returns
   */
  guardar(request: Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`, request);
  }

  /**
   * Editar un usuario
   * @param request
   * @returns
   */
  editar(request: Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`, request);
  }

  /**
   * Eliminar un usuario por id
   * @param id
   * @returns
   */
  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`);
  }
}
