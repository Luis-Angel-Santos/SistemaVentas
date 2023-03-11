import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  constructor(private router: Router,
              private _menuServ: MenuService,
              private _utilidadServ: UtilidadService){}
  
  ngOnInit(): void {
    const usuario = this._utilidadServ.obtenerSesionUsuario();
    if(usuario != null){
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      this._menuServ.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if(data.status){
            this.listaMenus = data.value;
          }
        },
        error: (err) => {
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');
        }
      });
    }
  }

  cerrarSesion(){
    Swal.fire({
      icon: 'warning',
      title: '¿Estas Seguro?',
      text: '¿Deseas cerrar la sesión?',
      confirmButtonColor: 'red',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: '#000080',
      confirmButtonText: 'Si, cerrar sesión',
      cancelButtonText: 'No, volver',
      focusConfirm: true,
    }).then((resp) => {
      if(resp.isConfirmed){
        this._utilidadServ.eliminarSesionUsuario()
        this.router.navigate(['login']);
      }
    });
    
  }

}