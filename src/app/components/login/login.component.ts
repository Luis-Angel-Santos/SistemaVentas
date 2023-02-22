import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilidadService } from '../../shared/utilidad.service';
import { UsuarioService } from '../../services/usuario.service';
import { Login } from 'src/app/interfaces/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private _utilidadServ: UtilidadService,
    private _usuarioServ: UsuarioService){
      this.formularioLogin = fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  iniciarSesion(){
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };
    this._usuarioServ.iniciarSesion(request).subscribe({ 
      next:(data) => {
        if(data.status){
          this._utilidadServ.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        }else{
          this._utilidadServ.mostrarAlerta('No se encontro ningun usuarios', 'Opps!')
        }  
      }, 
      complete: () => {
        this.mostrarLoading = false;
      },
      error: (err) => {
        this._utilidadServ.mostrarAlerta(`Parece que ha ocurrido un error: ${err.message}`, 'Opps!')    
      }
    })
  }


}
