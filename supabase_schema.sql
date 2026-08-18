-- ==========================================================
-- SCRIPT SQL PARA SUPABASE BASADO EN TU DIAGRAMA ENTIDAD-RELACIÓN
-- Compatible con PostgreSQL y Supabase Auth
-- ==========================================================

-- 1. TABLA: CATEGORIA
CREATE TABLE IF NOT EXISTS public.categoria (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255)
);

-- 2. TABLA: PRODUCTO
CREATE TABLE IF NOT EXISTS public.producto (
  id BIGSERIAL PRIMARY KEY,
  ref VARCHAR(50),
  medidas VARCHAR(50),
  nombre VARCHAR(100),
  descripcion VARCHAR(255),
  precio_unitario NUMERIC(10, 2) NOT NULL,
  estatus VARCHAR(20) DEFAULT 'Activo',
  stock_actual INT DEFAULT 0,
  categoria_id BIGINT REFERENCES public.categoria(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: INVENTARIO (Control de Stock Mínimo y Alertas)
CREATE TABLE IF NOT EXISTS public.inventario (
  id BIGSERIAL PRIMARY KEY,
  stock_minimo INT DEFAULT 10,
  producto_id BIGINT REFERENCES public.producto(id) ON DELETE CASCADE
);

-- 4. TABLA: USUARIO (Superentidad vinculada con Supabase Auth)
CREATE TABLE IF NOT EXISTS public.usuario (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(30),
  correo VARCHAR(100) UNIQUE NOT NULL,
  cedula VARCHAR(30),
  rol VARCHAR(30) DEFAULT 'Cliente', -- 'Cliente' | 'Administrador' | 'Asesor en ventas'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.1 SUBTIPO: CLIENTE
CREATE TABLE IF NOT EXISTS public.cliente (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuario(id) ON DELETE CASCADE,
  fecha_registro DATE DEFAULT CURRENT_DATE
);

-- 4.2 SUBTIPO: ADMINISTRADOR
CREATE TABLE IF NOT EXISTS public.administrador (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuario(id) ON DELETE CASCADE
);

-- 4.3 SUBTIPO: ASESOR EN VENTAS
CREATE TABLE IF NOT EXISTS public.asesor_ventas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuario(id) ON DELETE CASCADE
);

-- 5. TABLA: SOLICITUD (Pedidos)
CREATE TABLE IF NOT EXISTS public.solicitud (
  id BIGSERIAL PRIMARY KEY,
  fecha DATE DEFAULT CURRENT_DATE,
  estatus VARCHAR(30) DEFAULT 'Pendiente', -- 'Pendiente' | 'Pagado' | 'Enviado' | 'Cancelado'
  cliente_id UUID REFERENCES public.usuario(id) ON DELETE SET NULL,
  asesor_id BIGINT REFERENCES public.asesor_ventas(id) ON DELETE SET NULL,
  total NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: DETALLE_SOLICITUD
CREATE TABLE IF NOT EXISTS public.detalle_solicitud (
  id BIGSERIAL PRIMARY KEY,
  solicitud_id BIGINT REFERENCES public.solicitud(id) ON DELETE CASCADE,
  producto_id BIGINT REFERENCES public.producto(id) ON DELETE CASCADE,
  cantidad INT NOT NULL DEFAULT 1,
  precio NUMERIC(10, 2) NOT NULL
);

-- 7. TABLA: FACTURA (Conciliación y pagos)
CREATE TABLE IF NOT EXISTS public.factura (
  id BIGSERIAL PRIMARY KEY,
  fecha DATE DEFAULT CURRENT_DATE,
  total NUMERIC(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) DEFAULT 'Transferencia / Pago Móvil',
  solicitud_id BIGINT REFERENCES public.solicitud(id) ON DELETE SET NULL,
  asesor_id BIGINT REFERENCES public.asesor_ventas(id) ON DELETE SET NULL
);

-- 8. TABLA: DETALLE_FACTURA
CREATE TABLE IF NOT EXISTS public.detalle_factura (
  id BIGSERIAL PRIMARY KEY,
  factura_id BIGINT REFERENCES public.factura(id) ON DELETE CASCADE,
  producto_id BIGINT REFERENCES public.producto(id) ON DELETE CASCADE,
  cantidad INT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL
);

-- ==========================================================
-- POLÍTICAS DE SEGURIDAD (RLS) PARA ACCESO PÚBLICO / DEMO
-- ==========================================================
ALTER TABLE public.categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrador ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asesor_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_factura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura y escritura general categoria" ON public.categoria FOR ALL USING (true);
CREATE POLICY "Lectura y escritura general producto" ON public.producto FOR ALL USING (true);
CREATE POLICY "Lectura y escritura general inventario" ON public.inventario FOR ALL USING (true);
CREATE POLICY "Lectura y escritura general usuario" ON public.usuario FOR ALL USING (true);
CREATE POLICY "Lectura y escritura general solicitud" ON public.solicitud FOR ALL USING (true);
CREATE POLICY "Lectura y escritura general factura" ON public.factura FOR ALL USING (true);

-- ==========================================================
-- DATOS INICIALES DE PRUEBA
-- ==========================================================
INSERT INTO public.categoria (id, nombre, descripcion) VALUES
(1, 'Empaques de Lujo', 'Cajas rígidas, acabados dorados y cintas'),
(2, 'Microcorrugados', 'Cajas troqueladas con y sin ventana'),
(3, 'Unicolor', 'Modelos unicolor en blanco, negro y kraft'),
(4, 'Portavasos', 'Bases y transportadores de bebidas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.producto (id, ref, medidas, nombre, descripcion, precio_unitario, estatus, stock_actual, categoria_id) VALUES
(1, 'TC-001', '20x20x10 cm', 'Caja Happy Day Corazón', 'Caja romántica con asas y acabado fino', 89.99, 'Activo', 230, 1),
(2, 'TC-002', '15x15x15 cm', 'Caja Casita con Ventana', 'Caja con ventanas transparentes', 89.99, 'Activo', 15, 2),
(3, 'TC-003', '25x20x8 cm', 'Caja de Lujo Premium Gold', 'Caja dorada con cierre magnético', 89.99, 'Activo', 16, 1),
(4, 'TC-004', '10x10x5 cm', 'Portavasos Múltiple Ecológico', 'Base reforzada ecológica', 89.99, 'Activo', 10, 4)
ON CONFLICT (id) DO NOTHING;
