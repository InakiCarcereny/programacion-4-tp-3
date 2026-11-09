<div align="center">

# Cafetería Origen

### Sistema de gestión para la cafetería Origen

![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-%23252529.svg?style=for-the-badge&logo=vitest&logoColor=FCC72B)

## Integrantes - Grupo N-8

Iñaki Carcereny · Valentín De Pascale · Joaquín Marcilese · Ezequiel Barrionuevo

</div>

---

## Descripción

**Cafetería Origen** es un sistema de gestión para la cafetería Origen. Permite administrar productos y pedidos de manera eficiente, facilitando el control del negocio y mejorando la experiencia del usuario.

---

## Flujo y metodología de trabajo

| Rama         | Descripción                             |
| ------------ | --------------------------------------- |
| `main`       | Versión final de producción             |
| `dev`        | Integración de todas las features       |
| `feature/*`  | Nuevas funcionalidades                  |
| `refactor/*` | Mejoras y reestructuración del código   |
| `docs/*`     | Cambios en documentación                |
| `fix/*`      | Corrección de errores                   |
| `chore/*`    | Tareas de mantenimiento y configuración |
| `test/*`     | Pruebas unitarias                       |

---

## Convención de commits

| Prefijo     | Uso                                                   |
| ----------- | ----------------------------------------------------- |
| `feat:`     | Nueva funcionalidad                                   |
| `fix:`      | Corrección de bug                                     |
| `docs:`     | Cambios en documentación                              |
| `style:`    | Cambios de formato o estilo de código                 |
| `refactor:` | Reorganización de código                              |
| `chore:`    | Configuración, dependencias o tareas de mantenimiento |

---

## Estructura del proyecto

```
/
├── .husky/                # Hooks de Git (pre-commit, commit-msg)
├── .vscode/               # Configuración compartida del editor
├── backend/
│ ├── src/
│ │ ├── controllers/       # Manejo de requests y respuestas HTTP
│ │ ├── data/              # Catálogo de productos y pedidos en memoria
│ │ ├── errors/            # Clases de error custom (NotFoundError, ValidationError...)
│ │ ├── middlewares/       # Error handler, not-found handler, etc.
│ │ ├── models/            # Entidades de dominio (Product, Coffee, Pastry, Order...)
│ │ ├── routes/            # Definición de endpoints y registro de middlewares
│ │ ├── schemas/           # Validación de payloads con Zod
│ │ ├── services/          # Lógica de negocio entre controllers y models/data
│ │ ├── tests/             # Tests del backend (unitarios + e2e)
│ │ ├── types/             # Interfaces y tipos TypeScript compartidos
│ │ ├── app.ts             # Arma la instancia de Express (middlewares, rutas)
│ │ └── server.ts          # Entry point: levanta el servidor HTTP
├── frontend/
│ ├── src/
│ │ ├── components/        # Componentes de UI (Header, PastrySection, CartView...)
│ │ ├── context/           # Estado global del carrito (CartContext + cart-reducer)
│ │ ├── hooks/             # Custom hooks de React
│ │ ├── mocks/             # Handlers de MSW para mockear la API en tests
│ │ ├── schemas/           # Validación de respuestas de la API con Zod
│ │ ├── services/          # Cliente HTTP único
│ │ ├── styles/            # SCSS: variables de la paleta + override de Bootstrap
│ │ ├── tests/             # Tests del frontend (unitarios, componente,integración, e2e)
│ │ ├── types/             # Tipos TypeScript del dominio
│ │ ├── utils/             # Funciones auxiliares (formatPrice, etc.)
│ │ ├── App.tsx            # Componente raíz
│ │ └── main.tsx           # Entry point de React
├── .editorconfig          # Configuración de formato del editor
├── .gitignore             # Archivos excluidos del repositorio
├── .prettierrc.json       # Configuración de Prettier
├── commitlint.config.js   # Reglas para mensajes de commit
├── package.json           # Scripts globales del monorepo
├── pnpm-lock.yaml         # Lockfile único de pnpm para todo el monorepo
├── pnpm-workspace.yaml    # Declara qué carpetas son paquetes del workspace
└── README.md              # Documentación del proyecto
```

---

## Cómo arrancar (ambos)

```bash
pnpm install       # instala las dependencias de los dos paquetes
pnpm dev           # API en :3000 + front en :5173, en paralelo
```

## Scripts de la raíz

```bash
pnpm dev               # API + front en paralelo (modo watch)
pnpm dev:backend       # solo la API
pnpm dev:frontend      # solo el front
pnpm build             # compila los dos paquetes
pnpm test              # unitarios + componentes + integración de los dos paquetes
pnpm test:e2e          # Playwright (requiere API y front levantados o el webServer de Playwright)
pnpm lint              # eslint en los dos paquetes
```

Cada paquete también tiene sus propios scripts (`pnpm --filter cafeteria-origen-frontend <script>`,
o `cd frontend && pnpm <script>`).

---

## Contrato de la API

> **Todos los errores responden `{ "error": "mensaje" }`** — nunca un body distinto.

| Método | Ruta                    | Éxito | Sin permiso / no existe |
| ------ | ----------------------- | ----- | ----------------------- |
| GET    | `/health`               | `200` | —                       |
| GET    | `/products`             | `200` | —                       |
| GET    | `/products/:id`         | `200` | `404`                   |
| POST   | `/orders`               | `201` | `400` / `404`           |
| GET    | `/orders`               | `200` | —                       |
| GET    | `/orders/:id`           | `200` | `404`                   |
| GET    | `/reports/revenue`      | `200` | —                       |
| GET    | `/reports/best-selling` | `200` | `404`                   |
| POST   | `/__test__/reset`       | `204` | —                       |
| POST   | `/__test__/seed`        | `204` | —                       |

---

## GET /health

```json
{ "status": "ok", "uptime": 6.7716679, "timestamp": "2026-11-09T23:07:48.423Z" }
```

---

## GET /products

`200` — array de **20** productos. Dos shapes distintos:

### Café (id 1–18)

```json
{
  "id": 5,
  "type": "expreso",
  "name": "Expreso Mediano",
  "price": 7360,
  "size": "Mediano",
  "grams": 27,
  "variety": {
    "name": "Colombia",
    "description": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  }
}
```

### Pastelería (id 19–20)

```json
{ "id": 19, "type": "pasteleria", "name": "Muffin de chocolate", "price": 2500 }
```

---

## GET /products/:id

### `200` — café

```json
{
  "id": 5,
  "type": "expreso",
  "name": "Expreso Mediano",
  "price": 7360,
  "size": "Mediano",
  "grams": 27,
  "variety": {
    "name": "Colombia",
    "description": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  }
}
```

### `200` — pastelería

```json
{ "id": 19, "type": "pasteleria", "name": "Muffin de chocolate", "price": 2500 }
```

### `404` — cualquier id que no exista

```json
{ "error": "Producto 9999 no encontrado" }
```

> **Nota:** un id no numérico también responde `404`, no `400`:
>
> | Ruta             | Status | Body                                      |
> | ---------------- | ------ | ----------------------------------------- |
> | `/products/9999` | `404`  | `{"error":"Producto 9999 no encontrado"}` |
> | `/products/abc`  | `404`  | `{"error":"Producto abc no encontrado"}`  |
> | `/products/-1`   | `404`  | `{"error":"Producto -1 no encontrado"}`   |

---

## POST /orders

### Request

```json
{
  "mesaId": 4,
  "items": [
    { "productId": 5, "quantity": 2 },
    { "productId": 19, "quantity": 1 }
  ]
}
```

### `201` — con mesa

```json
{
  "id": "Order-1",
  "mesaId": 4,
  "items": [
    { "productId": 5, "quantity": 2 },
    { "productId": 19, "quantity": 1 }
  ],
  "status": "pending",
  "total": 17220
}
```

### `201` — sin mesa (retiro en barra)

```json
{
  "id": "Order-2",
  "items": [{ "productId": 19, "quantity": 2 }],
  "status": "pending",
  "total": 5000
}
```

---

## GET /orders

`200` — array con todos los pedidos, en orden de creación.

**Sin pedidos:**

```json
[]
```

**Con dos pedidos:**

```json
[
  {
    "id": "Order-1",
    "mesaId": 4,
    "items": [
      { "productId": 5, "quantity": 2 },
      { "productId": 19, "quantity": 1 }
    ],
    "status": "pending",
    "total": 17220
  },
  {
    "id": "Order-2",
    "items": [{ "productId": 19, "quantity": 2 }],
    "status": "pending",
    "total": 5000
  }
]
```

---

## GET /orders/:id

### `200`

```json
{
  "id": "Order-1",
  "mesaId": 4,
  "items": [
    { "productId": 5, "quantity": 2 },
    { "productId": 19, "quantity": 1 }
  ],
  "status": "pending",
  "total": 17220
}
```

### `404`

```json
{ "error": "Orden Order-999 no encontrada" }
```

### Valores posibles de `status`

| Valor       | Etiqueta en la UI |
| ----------- | ----------------- |
| `pending`   | Pendiente         |
| `preparing` | En preparación    |
| `delivered` | Entregado         |

---

## GET /reports/revenue

`200` — suma de `total` de todos los pedidos.

```json
{ "revenue": 22600 }
```

Sin ventas registradas:

```json
{ "revenue": 0 }
```

---

## GET /reports/best-selling

### `200` — con ventas

```json
{ "productId": 19, "name": "Muffin de chocolate", "quantity": 4 }
```

### `404` — sin ventas

```json
{ "error": "No hay ventas registradas" }
```

---

## POST /**test**/reset

`204` — sin body. Vacía la lista de pedidos.

> Solo disponible con `NODE_ENV=test`.

## POST /**test**/seed

`204` — sin body. Regenera el catálogo de productos y vacía los pedidos.

> Solo disponible con `NODE_ENV=test`.

---
