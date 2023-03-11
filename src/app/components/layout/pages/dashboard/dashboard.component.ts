import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilidadService } from '../../../../shared/utilidad.service';

import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '';

  constructor(private _dashboardServ: DashboardService,
              private _utilidadServ: UtilidadService){}

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]){
    const chartBarras = new Chart('chartBarras', {
       type: 'bar',
       data: {
        labels: labelGrafico,
        datasets: [{ 
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
         }]
       },
       options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y:{ 
            beginAtZero: true
          }
        }
       }
    });
  }

  ngOnInit(): void {
    this._dashboardServ.resumen().subscribe({
      next: (data) => {
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
        
          const arrayData: any[] = data.value.ventasUltimaSemana;
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          this.mostrarGrafico(labelTemp, dataTemp);

        }else{

        }
      },
      error: (err) => {
        this._utilidadServ.mostrarAlerta(`Ah ocurrido un error inesperado: ${err.message}`, 'Opps! ❌');
      },
    });
  }

}
