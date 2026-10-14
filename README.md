# frontend_customers

Aplicación web **Customers** del Reto 004.
Consume el microservicio `backend_customers` para consultar, filtrar y registrar clientes, y mostrar indicadores de nacimientos.

## Stack

| Componente | Versión |
|---|---|
| Angular | 18 (NgModule) |
| Angular Material | 18 |
| Gestor de paquetes | npm |
| Pruebas | Jasmine + Karma |

Estilos con la línea gráfica corporativa de Intercorp (azul marino / celeste), tipografía Montserrat y tema propio de Angular Material.

## Funcionalidades

| Pantalla | Ruta | Descripción |
|---|---|---|
| Clientes | `/clientes` | Tabla de clientes con ordenamiento y paginación; filtro por DNI y/o email; botón **Nuevo cliente** que abre el formulario de creación |
| Indicadores | `/indicadores` | Total de clientes, mes/año con mayor y menor cantidad de nacidos, tasa de natalidad por mes (gráfico de barras y tabla) y cantidad de nacidos por mes/año |

Formulario de creación con validaciones (campos obligatorios, email válido, DNI de 8 dígitos, fecha de nacimiento no futura). La fecha se puede escribir como `dd/mm/aaaa` o elegir en el calendario. Los errores del backend (por ejemplo DNI o email duplicado) se muestran en el formulario.

## Estructura

```
src/app
├── core
│   ├── config        # Adaptador de fechas dd/mm/aaaa y paginador en español
│   ├── models        # Interfaces Customer, CustomerIndicators, ...
│   ├── services      # CustomerService (comunicación con el backend) + pruebas
│   └── utils         # DateUtils
├── features
│   ├── customers     # customer-list (tabla + filtros), customer-form (diálogo de creación)
│   └── indicators    # Indicadores en tarjetas, gráfico y tablas
└── shared            # MaterialModule
```

## Requisitos

- Node.js 18.19+ (recomendado 20 LTS)
- npm 10+
- Backend `backend_customers` ejecutándose en `http://localhost:8080`

## Instalación y ejecución

```bash
git clone <url-del-repositorio>
cd frontend_customers
npm install
npm start
```

Abrir `http://localhost:4200`.

La URL del backend se configura en `src/environments/environment.ts` y `environment.development.ts`:

```ts
apiUrl: 'http://localhost:8080/api/v1'
```

## Build

```bash
npm run build
```

Salida en `dist/frontend_customers`.

## Pruebas unitarias

Las pruebas cubren el servicio `CustomerService` (consulta con y sin filtros, creación, indicadores y manejo de errores), usando `HttpTestingController`.

```bash
npm test          # modo watch
npm run test:ci   # una sola ejecución en Chrome headless
```
