import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UtilidadService } from '../utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _utilidadServ: UtilidadService,
              private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usuario = this._utilidadServ.obtenerSesionUsuario()
    if(usuario == null){
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tiene acceso. Por favor inicie sesión',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false
        });
        this.router.navigate(['login']);
    }
    return true;

  }

}
