export interface Venta {
  id: number,
  compania: string,
  producto: string,
  fecha: string,
  cantidad: number,
  precio: number
}

export interface VentaDTO {
  compania: string,
  producto: string,
  fecha: string,
  cantidad: number,
  precio: number
}

