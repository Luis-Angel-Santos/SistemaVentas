import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialVentaComponent } from './pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        path: 'usuarios',
        canActivate: [AuthGuard],
        component: UsuarioComponent
      },
      {
        path: 'productos',
        canActivate: [AuthGuard],
        component: ProductoComponent
      },
      {
        path: 'venta',
        canActivate: [AuthGuard],
        component: VentaComponent
      },
      {
        path: 'historial_venta',
        canActivate: [AuthGuard],
        component: HistorialVentaComponent
      },
      {
        path: 'reportes',
        canActivate: [AuthGuard],
        component: ReporteComponent
      },
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
