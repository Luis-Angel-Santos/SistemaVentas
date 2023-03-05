import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModalHistorialVentasComponent } from '../../modales/modal-historial-ventas/modal-historial-ventas.component';
import { VentaService } from '../../../../services/venta.service';
import { UtilidadService } from '../../../../shared/utilidad.service';
import { Venta } from '../../../../interfaces/venta';

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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit{

  formularioBusqueda: FormGroup;
  opcionesBUsqueda: any[] = [
    { value: 'fecha', descripcion: 'Por fechas' },
    { value: 'numero', descripcion: 'Número venta' },
  ];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVentas = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _ventaServ: VentaService, 
    private _utilidadServ: UtilidadService,
    private fb: FormBuilder,
    private dialog: MatDialog){

      this.formularioBusqueda = this.fb.group({
        buscaPor: ['fecha'],
        numero: [''],
        fechaInicio: [''],
        fechaFin: ['']
      });

      this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value => {
        this.formularioBusqueda.patchValue({
          numero: '',
          fechaInicio: '',
          fechaFin: ''
        });
      });

    }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  ngAfterViewInit(): void {
    this.datosListaVentas.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVentas.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas(){
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if(this.formularioBusqueda.value.buscarPor === 'fecha'){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD:MM:YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD:MM:YYYY');
      if(_fechaInicio === 'Invalid.date' || _fechaFin === 'Invalidate.date'){
        this._utilidadServ.mostrarAlerta('Debe ingresar una fecha de inicio y fecha de fin.', 'Opps ❌');
  
        return;
      }
    }

    this._ventaServ.historial(this.formularioBusqueda.value.buscarPor, this.formularioBusqueda.value.numero, _fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if(data.status){
          this.datosListaVentas = data.value;
        }else{
          this.formularioBusqueda.value.buscarPor,
          this._utilidadServ.mostrarAlerta('No se encontraron datos. Por favor intente de nuevo.', 'Opps ❌');
        }
      },
      error: (err) => {
        this._utilidadServ.mostrarAlerta(`Parece que ocurrio un error inesperado: ${err.message}`, 'Opps ❌');
      },
    });
  }

  verDetalleVenta(venta: Venta){
    this.dialog.open(ModalHistorialVentasComponent, {
      data: venta,
      disableClose: true,
      width: '700px'
    });
  }

}
