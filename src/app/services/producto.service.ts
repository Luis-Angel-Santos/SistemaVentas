import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlAPI: string = environment.endpoint + 'Producto/';

  constructor(private http: HttpClient) { }

  //obtener todos los productos
  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`);
  }

  //guardar un nuevo producto
  guardar(request: Producto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`, request);
  }

  //editar un producto existente
  editar(request: Producto):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`, request);
  }

  //eliminar un producto mediante su id
  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`);
  }
}
