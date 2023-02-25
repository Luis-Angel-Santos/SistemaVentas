import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private _rolServ: RolService,
    private _usuarioServ: UsuarioService,
    private _utilidadServ: UtilidadService,
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario) {
      this.formularioUsuario = this.fb.group({
        nombreCompleto: ['', Validators.required],
        correo: ['', Validators.required],
        idRol: ['', Validators.required],
        clave: ['', Validators.required],
        esActivo: ['', Validators.required],
      });

      if(datosUsuario != null){
        this.tituloAccion = 'Editar';
        this.botonAccion = 'Actualizar';
      }
      this._rolServ.lista().subscribe({
        next: (data) => {
            if(data.status) this.listaRoles = data.value
        },
        error: (err) => {}
      });
    }

  ngOnInit(): void {
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  guardarEditarUsuario(){
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol, 
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }
    if(this.datosUsuario == null){
      this._usuarioServ.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServ.mostrarAlerta('El usuario fue registrado correctamente', 'Ok ✔️')
            this.modalActual.close('true');
          }else{
            this._utilidadServ.mostrarAlerta('No se pudo registrar el usuario', 'Opps! ❌');
          }
        },
        error: (err) => { 
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err}`, 'Opps! ❌');
         }
      });
    }else{
      this._usuarioServ.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServ.mostrarAlerta('El usuario fue editado correctamente', 'Ok ✔️')
            this.modalActual.close('true');
          }else{
            this._utilidadServ.mostrarAlerta('No se pudo editar el usuario', 'Opps! ❌');
          }
        },
        error: (err) => { 
          this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err}`, 'Opps! ❌');
         }
      });
    }
  }

}
