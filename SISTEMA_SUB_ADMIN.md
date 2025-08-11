# Sistema de Sub-Administradores

## Descripción General

El sistema de sub-administradores permite que usuarios autorizados (como Ricardo Orlando Prescott Arias) puedan registrar usuarios en las plataformas RunningPips e IA MacLean, manteniendo un control jerárquico donde el administrador principal conserva el control total.

## Características Principales

### Para el Sub-Administrador (Ricardo)
- ✅ Puede registrar usuarios en ambas plataformas (RunningPips e IA MacLean)
- ✅ Puede ver todos los usuarios que él ha registrado
- ✅ Puede ver el estado de activación y fechas de vencimiento
- ❌ NO puede activar/desactivar usuarios
- ❌ NO puede editar fechas de usuarios
- ❌ NO puede ver usuarios registrados por otros administradores

### Para el Administrador Principal
- ✅ Control total sobre todos los usuarios
- ✅ Puede ver quién registró cada usuario
- ✅ Puede filtrar usuarios por registrador
- ✅ Puede activar/desactivar cualquier usuario
- ✅ Puede editar fechas de cualquier usuario

## Acceso al Sistema

### URLs de Acceso
- **Página principal**: `http://localhost:3002/`
- **Sub-Administrador**: `http://localhost:3002/sub-admin`
- **Admin Principal**: `http://localhost:3002/admin`

### Credenciales de Sub-Administrador
- **Email**: `ricardo.prescott@gmail.com`
- **Contraseña**: `Ricardo2024!`

## Flujo de Trabajo

### 1. Registro de Usuario por Sub-Admin
1. Ricardo accede a `/sub-admin/login`
2. Inicia sesión con sus credenciales
3. Va a "Registrar Usuario" o `/sub-admin/registro`
4. Completa el formulario con los datos del usuario
5. Selecciona la plataforma (RunningPips o IA MacLean)
6. El usuario se registra con estado "Inactivo" por defecto

### 2. Activación por Admin Principal
1. El administrador principal ve el nuevo usuario en su panel
2. En la columna "Registrado Por" aparece "Ricardo Prescott"
3. El admin principal puede activar al usuario
4. Una vez activado, el usuario puede acceder a su plataforma

### 3. Seguimiento por Sub-Admin
1. Ricardo puede ver en su dashboard el estado actualizado
2. Ve si el usuario está activo/inactivo
3. Ve las fechas de vencimiento
4. Puede registrar más usuarios según sea necesario

## Estructura de Archivos

```
src/app/sub-admin/
├── page.tsx              # Página de inicio del sub-admin
├── login/
│   └── page.tsx          # Login específico para sub-admin
├── registro/
│   └── page.tsx          # Formulario de registro de usuarios
└── dashboard/
    └── page.tsx          # Panel de control del sub-admin
```

## Base de Datos

### Campo Agregado
- `registradoPor`: String que identifica el email del administrador que registró al usuario
  - `"macleanjhon8@gmail.com"` = Admin Principal
  - `"ricardo.prescott@gmail.com"` = Ricardo Prescott

### Migración Realizada
Se ejecutó una migración para agregar el campo `registradoPor` a todos los usuarios existentes, asignándoles el admin principal como registrador.

## Seguridad

### Autenticación
- Sistema de autenticación simple basado en localStorage
- Verificación de credenciales hardcodeadas para Ricardo
- Redirección automática si no está autenticado

### Permisos
- Sub-admin solo puede ver sus propios usuarios
- Sub-admin no puede modificar usuarios existentes
- Admin principal mantiene control total

## Personalización

### Agregar Nuevos Sub-Administradores
Para agregar un nuevo sub-administrador:

1. Modificar `/sub-admin/login/page.tsx`:
```javascript
if (email === "nuevo.admin@gmail.com" && password === "NuevaPassword123!") {
  // Lógica de login
}
```

2. Agregar la opción en el filtro del admin principal en `/admin/page.tsx`:
```javascript
<option value="nuevo.admin@gmail.com">Nuevo Admin</option>
```

### Modificar Credenciales de Ricardo
Cambiar en `/sub-admin/login/page.tsx`:
```javascript
if (email === "ricardo.prescott@gmail.com" && password === "NUEVA_PASSWORD") {
```

## Endpoints API Utilizados

- `GET /api/registros` - Obtener todos los usuarios
- `POST /api/registros` - Crear nuevo usuario (con campo registradoPor)
- `PUT /api/registros` - Activar/desactivar usuario (solo admin principal)
- `DELETE /api/registros/[id]` - Eliminar usuario (solo admin principal)
- `POST /api/migrar-registrador` - Migración de usuarios existentes

## Próximas Mejoras Sugeridas

1. **Autenticación JWT**: Implementar un sistema de autenticación más robusto
2. **Roles y Permisos**: Sistema más granular de permisos
3. **Notificaciones**: Notificar al admin principal cuando se registra un nuevo usuario
4. **Estadísticas**: Dashboard con métricas para sub-administradores
5. **Logs de Actividad**: Registro de todas las acciones realizadas

## Soporte

Para problemas o consultas:
- **Admin Principal**: macleanjhon8@gmail.com
- **Documentación**: Este archivo README
- **Logs**: Revisar la consola del navegador y del servidor
