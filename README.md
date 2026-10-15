# frontend_customers

Aplicación web **Customers** del Reto 004.

Consume el microservicio `backend_customers` y permite:

- ver los clientes en una tabla
- buscar clientes por DNI o email
- registrar un nuevo cliente
- ver los indicadores en tablas y en un gráfico de barras

## Tecnologías

- Angular 18
- Angular Material
- npm
- Jasmine y Karma para las pruebas

## Cómo ejecutarlo

Se necesita Node.js 18 o superior y tener levantado el backend en `http://localhost:8080`.

```bash
npm install
npm start
```

Luego abrir `http://localhost:4200`.

Si el backend está en otra URL, se cambia en `src/environments/environment.ts` y `src/environments/environment.development.ts`.

## Pantallas

- **Clientes** (`/clientes`): listado, filtros y botón para registrar un nuevo cliente.
- **Indicadores** (`/indicadores`): total de clientes, mes/año con más y menos nacidos, tasa de natalidad por mes y cantidad de nacidos por mes/año.

## Pruebas

Las pruebas unitarias son del servicio `CustomerService`.

```bash
npm test
```
