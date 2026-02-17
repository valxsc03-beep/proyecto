# 🏠 Gestor de Propiedades Inmobiliarias

Aplicación web desarrollada con **HTML, CSS y JavaScript Vanilla** para gestionar propiedades inmobiliarias.

Permite crear, editar, eliminar, filtrar y buscar propiedades, con persistencia de datos usando `localStorage`.

---

## Funcionalidades

- Crear propiedades
- Editar propiedades
- Eliminar propiedades
- Marcar como disponibles / no disponibles
- Buscar por nombre, descripción o ubicación
- iltrar por tipo, prioridad y disponibilidad
- Estadísticas automáticas
- Persistencia de datos con localStorage

---

## Estructura del Proyecto

WEEK-2/
│
├── index.html
├── styles.css
└── starter/
└── script.js


---

## Modelo de Propiedad

Cada propiedad contiene:

```js
{
  id: string,
  name: string,
  description: string,
  category: "house" | "apartment" | "land" | "commercial",
  priority: "low" | "medium" | "high",
  price: number,
  location: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}
