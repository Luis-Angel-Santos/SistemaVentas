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

  private urlAPI: string = environment.endpoint + 'Usuario';

  constructor(private http: HttpClient) { }

  //iniciar sesion con las credenciales
  iniciarSesion(request: Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}IniciarSesion`, request);
  }

  //obtener todos los usuarios
  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`);
  }

  //guardar un nuevo usuario
  guardar(request: Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`, request);
  }

  //editar un usuario existente
  editar(request: Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`, request);
  }

  //eliminar un usuario mediante su id
  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`);
  }
}
