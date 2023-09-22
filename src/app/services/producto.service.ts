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

  /**
   * Obtener lista de productos
   * @returns
   */
  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`);
  }

  /**
   * Guardar un producto nuevo
   * @param request
   * @returns
   */
  guardar(request: Producto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Guardar`, request);
  }

  /**
   * Editar un producto
   * @param request
   * @returns
   */
  editar(request: Producto):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}Editar`, request);
  }

  /**
   * Eliminar un producto por id
   * @param id
   * @returns
   */
  eliminar(id: number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}Eliminar/${id}`);
  }
}
