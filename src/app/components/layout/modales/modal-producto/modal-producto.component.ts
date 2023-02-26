import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit{

  formularioProducto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private _categoriaServ: CategoriaService,
    private _productoServ: ProductoService,
    private _utilidadServ: UtilidadService,
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto) {
      this.formularioProducto = this.fb.group({
        nombre: ['', Validators.required],
        idCategoria: ['', Validators.required],
        stock: ['', Validators.required],
        precio: ['', Validators.required],
        esActivo: ['1', Validators.required]
      });

      if(this.datosProducto != null){
        this.tituloAccion = 'Editar';
        this.botonAccion = 'Actualizar';
      }
      this._categoriaServ.lista().subscribe({
        next: (data) => {
            if(data.status) this.listaCategorias = data.value
        },
        error: (err) => {}
      });
    }

  ngOnInit(): void {
    if(this.datosProducto != null){
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditarProducto(){
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre:  this.formularioProducto.value.nombre,
      idCategoria:  this.formularioProducto.value.idCategoria,
      descripcionCategoria:  '',
      stock:  this.formularioProducto.value.stock,
      precio:  this.formularioProducto.value.precio,
      esActivo:  parseInt(this.formularioProducto.value.esActivo)
    };
    if(this.datosProducto == null){
      this._productoServ.guardar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServ.mostrarAlerta('El producto fue registrado correctamente', 'Ok ✔️')
            this.modalActual.close('true');
          }else{
            this._utilidadServ.mostrarAlerta('No se pudo registrar el producto. Por favor intente de nuevo.', 'Opps! ❌');
          }
        },
        error: (err) => { 
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');
         }
      });
    }else{
      this._productoServ.editar(_producto).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServ.mostrarAlerta('El producto fue editado correctamente', 'Ok ✔️')
            this.modalActual.close('true');
          }else{
            this._utilidadServ.mostrarAlerta('No se pudo editar el producto. Por favor intente de nuevo.', 'Opps! ❌');
          }
        },
        error: (err) => { 
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');
         }
      });
    }
  }
}
