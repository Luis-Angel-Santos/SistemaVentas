import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado','acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(private _usuarioServ: UsuarioService,
              private _utilidadServ: UtilidadService,
              private dialog: MatDialog,){}

  obtenerUsuarios(){
    this._usuarioServ.lista().subscribe({
      next: (data) => {
          if(data.status){
            this.dataListaUsuarios.data = data.value;
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
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true'){
        this.obtenerUsuarios();
      } 
    });
  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === 'true'){
        this.obtenerUsuarios();
      } 
    });
  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Desea eliminar al usuario: ${usuario.nombreCompleto}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      cancelButtonColor: '#d33'
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._usuarioServ.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServ.mostrarAlerta('El usuario fue eliminado correctamente', 'Ok ✔️');
              this.obtenerUsuarios();
            }else{              
              this._utilidadServ.mostrarAlerta('No se pudo eliminar el usuario. Por favor intente de nuevo.', 'Error ❌');
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
