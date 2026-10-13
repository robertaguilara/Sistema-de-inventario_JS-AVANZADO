import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Producto,
  CriterioOrdenamiento
} from '../models/producto';

export interface Movimiento {
  id?: number | string;
  productoId: number;
  productoNombre: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  stockResultante: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private readonly http = inject(HttpClient);

  private readonly urlProductos =
    'http://localhost:3000/productos';

  private readonly urlMovimientos =
    'http://localhost:3000/movimientos';

  // Consultar todos los productos.
  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.urlProductos);
  }

  // Registrar un producto.
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(
      this.urlProductos,
      producto
    );
  }

  // Actualizar los datos de un producto.
  actualizarProducto(
    producto: Producto
  ): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.urlProductos}/${producto.id}`,
      producto
    );
  }

  // Eliminar un producto.
  eliminarProductoApi(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.urlProductos}/${id}`
    );
  }

  // Consultar los movimientos del inventario.
  listarMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      this.urlMovimientos
    );
  }

  // Registrar un movimiento de stock.
  crearMovimiento(
    movimiento: Movimiento
  ): Observable<Movimiento> {
    return this.http.post<Movimiento>(
      this.urlMovimientos,
      movimiento
    );
  }

  // Eliminar un movimiento del historial.
  eliminarMovimiento(
    id: number | string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.urlMovimientos}/${id}`
    );
  }

  // Validar los datos de un producto.
  validarProducto(producto: Producto): boolean {
    return Number.isInteger(producto.id) &&
      producto.id > 0 &&
      producto.nombre.trim() !== '' &&
      producto.categoria.trim() !== '' &&
      Number.isFinite(producto.precio) &&
      producto.precio > 0 &&
      Number.isInteger(producto.stock) &&
      producto.stock >= 0;
  }

  // Ordenar una lista de productos.
  ordenarProductos(
    productos: Producto[],
    criterio: CriterioOrdenamiento
  ): Producto[] {
    const lista = [...productos];

    switch (criterio) {
      case 'nombre-asc':
        return lista.sort(
          (a, b) => a.nombre.localeCompare(b.nombre)
        );

      case 'nombre-desc':
        return lista.sort(
          (a, b) => b.nombre.localeCompare(a.nombre)
        );

      case 'precio-asc':
        return lista.sort(
          (a, b) => a.precio - b.precio
        );

      case 'precio-desc':
        return lista.sort(
          (a, b) => b.precio - a.precio
        );

      case 'stock-asc':
        return lista.sort(
          (a, b) => a.stock - b.stock
        );

      case 'stock-desc':
        return lista.sort(
          (a, b) => b.stock - a.stock
        );

      default:
        return lista;
    }
  }

  // Calcular el total de unidades.
  calcularTotalUnidades(productos: Producto[]): number {
    return productos.reduce(
      (total, producto) => total + producto.stock,
      0
    );
  }

  // Calcular el valor total del inventario.
  calcularValorInventario(productos: Producto[]): number {
    return productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.stock,
      0
    );
  }

  // Contar los productos con stock bajo.
  contarStockBajo(productos: Producto[]): number {
    return productos.filter(
      (producto) =>
        producto.stock > 0 && producto.stock < 5
    ).length;
  }
}