import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../settings';
import { Venta, VentaDTO } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private http = inject(HttpClient)
  private apiUrl = appSettings.apiUrl

  constructor() { }

  getAllVentas() {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  getVentaById(id: number) {
    return this.http.get<Venta>(this.apiUrl + '/' + id)
  }

  createVenta(venta: VentaDTO) {
    console.log(venta)
    return this.http.post<Venta>(this.apiUrl, venta)
  }

  updateVenta(id: number, venta: VentaDTO) {
    return this.http.put(this.apiUrl + '/' + id, venta)
  }

  removeVenta(id: number) {
    return this.http.delete(this.apiUrl + '/' + id);
  }

}
