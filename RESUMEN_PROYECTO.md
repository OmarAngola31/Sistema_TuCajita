# 📦 Tu Cajita - E-Commerce con Integración CRM
**Proyecto para la materia Multimedia (Ingeniería Informática)**

---

## 🎯 Resumen Ejecutivo para la Presentación
Este proyecto implementa una plataforma web de E-Commerce moderna con integraciones funcionales de CRM, orientada al negocio de empaques, cajas de lujo y arreglos personalizados (**"Tu Cajita"**).

El sistema está diseñado en arquitectura de 3 capas y soporta **3 roles de usuario** claramente diferenciados:
1. **Cliente (E-Commerce)**
2. **Asesor de Ventas (CRM & Atención Comercial)**
3. **Administrador (Gestión General, Inventario y Analítica)**

---

## 👥 1. Roles de Usuario y Funcionalidades

### 👤 A. Cliente
- **Landing Page & Catálogo**: Visualización dinámica de productos por categoría (*Empaques de lujo, Microcorrugados, Unicolor, Portavasos*).
- **Detalle del Producto**: Modal interactivo con medidas, especificaciones y selector de cantidad.
- **Carrito de Compras (`CartContext`)**: Almacenamiento persistente en local storage, cálculo automático de subtotal, IVA y envío.
- **Checkout & Confirmación**: Flujo de compra con captura de datos de envío y métodos de pago venezolanos (Pago Móvil, Zelle, Transferencia Banesco, Efectivo USD).

### 🧑‍💼 B. Asesor de Ventas (CRM de Ventas)
- **Gestión de Pedidos de Clientes**: Búsqueda en tiempo real por nombre, correo o código de pedido (`#20016`).
- **Filtrado por Estatus**: *Pendiente*, *Pagado*, *Enviado*, *Cancelado*.
- **Creación Directa de Pedidos**: Formulario para registrar compras manuales a nombre de un cliente que solicita cotizaciones telefónicas o por redes sociales.
- **Integración WhatsApp CRM (`wa.me`)**: Botón para enviar automáticamente el resumen y factura digital del pedido al WhatsApp del cliente con un formato estructurado.

### 🛡️ C. Administrador (Dashboard Ejecutivo)
- **KPIs en Tiempo Real**: Ventas totales del mes, tasa de conversión (46.7%), tiempo promedio de envío, control de reembolsos.
- **Historial CRM de Clientes**: Matriz agregada que consolida cliente por cliente: total de pedidos realizados, monto acumulado gastado ($), fecha de última compra y desglose completo.
- **Gestión de Inventario (Stock)**: Alertas automáticas por colores:
  - 🟢 *Normal*: Stock suficiente.
  - 🟡 *Warning*: Cercano al punto de reorden.
  - 🔴 *Danger*: Stock crítico. Ajuste manual rápido de unidades (+ / -).
- **CRUD de Catálogo**: Publicar, editar precio, descripción, medidas, stock y eliminar productos.
- **Conciliación de Pagos y Facturas**: Módulo para registrar comprobantes bancarios y emitir facturas digitales asociadas a las solicitudes.

---

## 🛠️ 2. Arquitectura Técnica
- **Frontend**: React 19 + Vite 6 + Tailwind CSS 4.
- **Diseño**: Interfaz moderna de alto impacto visual (colores Tailwind curados, Fredoka One, bordes redondeados `rounded-2xl`, sombras suaves y micro-animaciones).
- **Persistencia & Backend**:
  - Compatible con **Supabase** (`supabase_schema.sql` con esquema de base de datos relacional).
  - Servicio **`dbService.js`** con datos *mock* de respaldo para garantizar un funcionamiento impecable 100% offline o durante la demostración en vivo.
- **Accesos Rápido (Demo Mode)**:
  - La pantalla de login incluye botones de **Acceso en 1 Clic**:
    - `⚡ Probar Vista Administrativa` (Ingresa directo como Admin).
    - `🧑‍💼 Probar Vista de Asesor de Ventas` (Ingresa directo como Asesor).

---

## 📜 3. Estructura de la Base de Datos (`supabase_schema.sql`)
1. **`categoria`**: Categorías del catálogo.
2. **`producto`**: Productos, precios, medidas y referencias.
3. **`inventario`**: Control de stock mínimo y alertas.
4. **`usuario`**: Superentidad (vínculo con Auth).
5. **`cliente` / `asesor_ventas` / `administrador`**: Subtipos de roles.
6. **`solicitud` & `detalle_solicitud`**: Transacciones de e-commerce (pedidos).
7. **`factura` & `detalle_factura`**: Facturación y conciliación bancaria.

---

## 🚀 4. Instrucciones para Ejecutar la Presentación
1. Abrir la terminal en la carpeta del proyecto.
2. Ejecutar:
   ```bash
   npm run dev
   ```
3. Abrir el enlace local (`http://localhost:5173`).
4. Para la demo:
   - Probar la tienda como **Cliente** agregando cajas al carrito.
   - Ir a **Iniciar Sesión** y presionar **`Probar Vista de Asesor de Ventas (1 Clic)`** para mostrar la integración CRM con WhatsApp.
   - Ir a **Iniciar Sesión** y presionar **`Probar Vista Administrativa (1 Clic)`** para mostrar los gráficos, alertas de stock y el CRM de clientes.
