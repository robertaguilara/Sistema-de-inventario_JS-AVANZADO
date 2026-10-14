import { z } from 'zod';

export const ProductoSchema = z.object({
  id: z.number().int().positive({ message: 'El ID debe ser un número entero positivo' }),
  nombre: z.string().trim().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  categoria: z.string().trim().min(2, { message: 'La categoría debe tener al menos 2 caracteres' }),
  precio: z.number().positive({ message: 'El precio debe ser un número mayor a cero' }),
  stock: z.number().int().nonnegative({ message: 'El stock no puede ser negativo' }),
});

export const CrearProductoSchema = ProductoSchema;

export const ActualizarProductoSchema = ProductoSchema.partial().extend({
  id: z.number().int().positive(),
});

export const MovimientoTipoEnum = z.enum(['entrada', 'salida']);

export const MovimientoSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  productoId: z.number().int().positive({ message: 'ID de producto inválido' }),
  productoNombre: z.string().min(1),
  tipo: MovimientoTipoEnum,
  cantidad: z.number().int().positive({ message: 'La cantidad debe ser mayor a 0' }),
  stockResultante: z.number().int().nonnegative(),
  fecha: z.string().datetime().or(z.string()),
});

export const RegistrarMovimientoDtoSchema = z.object({
  productoId: z.number().int().positive({ message: 'Debe seleccionar un producto' }),
  tipo: MovimientoTipoEnum,
  cantidad: z.number().int().positive({ message: 'La cantidad debe ser mayor a 0' }),
});

export const CriterioOrdenamientoSchema = z.enum([
  'nombre-asc',
  'nombre-desc',
  'precio-asc',
  'precio-desc',
  'stock-asc',
  'stock-desc',
]);
