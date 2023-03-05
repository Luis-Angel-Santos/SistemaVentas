import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import { Venta } from '../../../../interfaces/venta';


@Component({
  selector: 'app-modal-historial-ventas',
  templateUrl: './modal-historial-ventas.component.html',
  styleUrls: ['./modal-historial-ventas.component.css']
})
export class ModalHistorialVentasComponent implements OnInit{

  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {

      this.fechaRegistro = _venta.fechaRegistro!;
      this.numeroDocumento = _venta.numeroDocumento!;
      this.tipoPago = _venta.tipoPago;
      this.total = _venta.totalTexto;
      this.detalleVenta = _venta.detalleVenta;
  
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }



}
