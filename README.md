# Frontend - Angular

## Requisitos
- Docker

## Levantar con Docker

```bash
# Crear red compartida (si no existe)
docker network create mi-red

# Construir imagen
docker build -t angular-client .

# Ejecutar contenedor
docker run -d --name AngularClient --network mi-red -p 4200:80 angular-client
```

La app queda disponible en http://localhost:4200
