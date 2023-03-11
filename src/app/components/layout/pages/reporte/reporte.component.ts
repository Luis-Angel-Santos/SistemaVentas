import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Reporte } from 'src/app/interfaces/reporte';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MMMM/YYYY'
  },
  display: {
    dateInput: 'DD/MMMM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReporteComponent implements OnInit, AfterViewInit{
  
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private _ventaServ: VentaService, 
    private _utilidadServ: UtilidadService,
    private fb: FormBuilder,
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas(){
    
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const  _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');
    
    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this._utilidadServ.mostrarAlerta('Debes ingresar una fecha de inicio y una fecha de fin.', 'Opps ❌');
      
      return;
    }

    this._ventaServ.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if(data.status){
          this.dataVentaReporte.data = data.value;
          this.listaVentasReporte = data.value;
        }else{
          this._utilidadServ.mostrarAlerta('No se encontraron datos relacionados', 'Opps ❌');
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
        }
      },
      error: (err) => {
        this._utilidadServ.mostrarAlerta(`Parece que ocurrio un error inesperado: ${err.message}`, 'Opps ❌');
      },
    });
  }

  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);
    XLSX.utils.book_append_sheet(wb,ws,'Reporte');
    XLSX.writeFile(wb,'Reporte_Ventas.xlsx')
  }

}
