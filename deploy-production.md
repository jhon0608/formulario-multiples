# 🚀 Guía de Despliegue a Producción

## Pasos para Desplegar el Sistema de Sub-Administradores

### 1. **Preparar Variables de Entorno**

Crear archivo `.env.production` en el servidor:

```bash
# MongoDB Configuration - PRODUCCIÓN
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProd
MONGODB_DB=formulario-elite-prod

# Admin Email
ADMIN_EMAIL=macleanjhon8@gmail.com

# Sub-Admin Credentials
SUB_ADMIN_EMAIL=ricardo.prescott@gmail.com
SUB_ADMIN_PASSWORD=Ricardo2024!

# Configuración de Producción
NODE_ENV=production
NEXTAUTH_URL=https://tudominio.com
```

### 2. **Actualizar Dominio en Configuración**

Editar `src/config/app.ts` y cambiar:
```typescript
BASE_URL: process.env.NODE_ENV === 'production' 
  ? 'https://TU-DOMINIO-REAL.com'  // 👈 CAMBIAR AQUÍ
  : 'http://localhost:3002',
```

### 3. **Comandos de Despliegue**

```bash
# 1. Instalar dependencias
npm install

# 2. Construir para producción
npm run build

# 3. Iniciar en producción
npm start
```

### 4. **URLs de Producción para Ricardo**

Una vez desplegado, Ricardo podrá acceder a:

- **Página Principal**: `https://tudominio.com/`
- **Login Sub-Admin**: `https://tudominio.com/sub-admin/login`
- **Dashboard**: `https://tudominio.com/sub-admin/dashboard`
- **Registro**: `https://tudominio.com/sub-admin/registro`

### 5. **Verificación Post-Despliegue**

Probar que funcionen:
- ✅ Login de Ricardo
- ✅ Registro de usuarios
- ✅ Vista de usuarios en dashboard
- ✅ Panel de admin principal
- ✅ Filtros por registrador

### 6. **Configuración de Servidor Web (Nginx)**

```nginx
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tudominio.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. **Monitoreo y Logs**

```bash
# Ver logs de la aplicación
pm2 logs

# Monitorear estado
pm2 status

# Reiniciar si es necesario
pm2 restart app
```

## 🔐 **Credenciales de Producción para Ricardo**

- **URL**: `https://tudominio.com/sub-admin/login`
- **Email**: `ricardo.prescott@gmail.com`
- **Password**: `Ricardo2024!`

## 📞 **Soporte**

Si Ricardo tiene problemas:
1. Verificar que la URL sea correcta
2. Limpiar caché del navegador
3. Contactar al admin principal: macleanjhon8@gmail.com
