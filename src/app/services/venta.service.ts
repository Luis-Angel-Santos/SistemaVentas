import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlAPI: string = environment.endpoint + 'Venta';

  constructor(private http: HttpClient) { }

  //registrar una venta
  registrar(request: Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}Registrar`, request);
  }

  //consultar ventas
  historial(buscarPor: string, numeroVenta: string, fechaInicio: string, fechaFin: string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  //generar reporte de ventas
  reporte(fechaInicio: string, fechaFin: string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
