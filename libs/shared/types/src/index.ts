import { z } from 'zod';
import {
  ProductoSchema,
  CrearProductoSchema,
  ActualizarProductoSchema,
  MovimientoSchema,
  RegistrarMovimientoDtoSchema,
  CriterioOrdenamientoSchema,
} from '../../contracts/src';

export type Producto = z.infer<typeof ProductoSchema>;
export type CrearProductoDto = z.infer<typeof CrearProductoSchema>;
export type ActualizarProductoDto = z.infer<typeof ActualizarProductoSchema>;

export type Movimiento = z.infer<typeof MovimientoSchema>;
export type RegistrarMovimientoDto = z.infer<typeof RegistrarMovimientoDtoSchema>;
export type TipoMovimiento = 'entrada' | 'salida';
export type CriterioOrdenamiento = z.infer<typeof CriterioOrdenamientoSchema>;

export interface InventarioMetricas {
  totalProductos: number;
  totalUnidades: number;
  valorInventario: number;
  productosStockBajo: number;
}
