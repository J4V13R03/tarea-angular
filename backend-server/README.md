# Backend - Express + MySQL

## Requisitos
- Docker

## Levantar con Docker

```bash
# Crear red compartida (si no existe)
docker network create mi-red

# Construir imagen
docker build -t backend-server .

# Ejecutar MySQL
docker run -d --name MyMySQLServer --network mi-red \
  -e MYSQL_ROOT_PASSWORD=1234 \
  -e MYSQL_DATABASE=acme \
  -p 3306:3306 \
  mysql:8

# Ejecutar Backend
docker run -d --name BackendServer --network mi-red \
  -e MYSQL_HOST=MyMySQLServer \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=1234 \
  -e MYSQL_DATABASE=acme \
  -p 3000:3000 \
  backend-server
```

La API queda disponible en http://localhost:3000
