import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from '../../../../services/producto.service';
import { VentaService } from '../../../../services/venta.service';
import { Producto } from '../../../../interfaces/producto';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import { Venta } from 'src/app/interfaces/venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit{

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipoPago: string = 'Efectivo';
  totalPagar: number = 0;
  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto','cantidad','precio','total','accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  productosFiltro(busqueda: any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private _productoServ: ProductoService,
    private _ventaServ: VentaService,
    private _fb: FormBuilder,
    private _utilidadServ: UtilidadService){
      
      this.formularioProductoVenta = this._fb.group({
        producto: ["", Validators.required],
        cantidad: ["", Validators.required]
      });

      this._productoServ.lista().subscribe({
        next: (data) => {
          if(data.status){
            const lista = data.value as Producto[];
            this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
          }
        },
        error: (e) => {
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${e.message}`, 'Opps! ❌');
        }
      });

      this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
        this.listaProductosFiltro = this.productosFiltro(value);
      });

  }
  
  ngOnInit(): void { }

  mostrarProducto(producto: Producto): string{
    return producto.nombre;
  }

  productoParaVenta(event: any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoVenta(){
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    });
  }

  eliminarProducto(detalleV: DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalleV.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalleV.idProducto);

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  }

  registrarVenta(){
    if(this.listaProductosParaVenta.length > 0){
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipoPago,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta
      };

      this._ventaServ.registrar(request).subscribe({
        next: (data) => {
          if(data.status){
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta registrada correctamente!',
              text: `Número de venta ${data.value.numeroDocumento}`,
              showConfirmButton: false,
              showCancelButton: false,
              timer: 5000,
              allowOutsideClick: false,
              timerProgressBar: true,
            });
          }else{
            this._utilidadServ.mostrarAlerta('No se pudo registrar la venta. Por favor intente de nuevo', 'Opps ❌')
          }
        },
        complete:() => {
            this.bloquearBotonRegistrar = false;
        },
        error:(err) => {
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');  
        },
      });
    } 
  }

}
