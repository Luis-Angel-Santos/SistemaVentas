import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{
  
  columnasTabla: string[] = ['nombre', 'categoria', 'stock','precio', 'estado','acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(private _productoServ: ProductoService,
              private _utilidadServ: UtilidadService,
              private dialog: MatDialog,){}

  obtenerProductos(){
    this._productoServ.lista().subscribe({
      next: (data) => {
          if(data.status){
            this.dataListaProductos.data = data.value;
          }else{
            this._utilidadServ.mostrarAlerta('No se encontraron datos', 'Opps! ❌');
          }
      },
      error: (err) => {
        this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');
      }
    });
  }
  
  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto(){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true'){
        this.obtenerProductos();
      } 
    });
  }

  editarProducto(producto: Producto){
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true'){
        this.obtenerProductos();
      } 
    });
  }

  eliminarProducto(producto: Producto){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Desea eliminar el producto: ${producto.nombre}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      cancelButtonColor: '#d33'
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._productoServ.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServ.mostrarAlerta('El producto fue eliminado correctamente', 'Ok ✔️');
              this.obtenerProductos();
            }else{              
              this._utilidadServ.mostrarAlerta('No se pudo eliminar el producto. Por favor intente de nuevo.', 'Error ❌');
            }
          },
          error: (err) => {
            this._utilidadServ.mostrarAlerta(`Parece que ocurrio un error inesperado: ${err.message}`, 'Error ❌');
          }
        });
      }
    });
  }

}
