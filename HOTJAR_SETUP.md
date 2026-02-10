# Configuración de Hotjar para Clientes Específicos

Hotjar está configurado para cargarse **solo** cuando el `clientId` es igual a `311` o `2134`.

## Pasos para configurar:

### 1. Obtener tu Site ID de Hotjar

1. Inicia sesión en tu cuenta de Hotjar: https://insights.hotjar.com/
2. Ve a **Settings** → **Sites**
3. Copia el **Site ID** (es un número, por ejemplo: `1234567`)

### 2. Configurar la variable de entorno

Crea un archivo `.env.local` en la raíz del proyecto (si no existe) y agrega:

```env
NEXT_PUBLIC_HOTJAR_SITE_ID=tu_site_id_aqui
```

**Ejemplo:**
```env
NEXT_PUBLIC_HOTJAR_SITE_ID=1234567
```

### 3. Reiniciar el servidor de desarrollo

Después de agregar la variable de entorno, reinicia el servidor:

```bash
npm run dev
```

## Cómo funciona:

- ✅ Hotjar **solo se carga** cuando el usuario tiene `clientId === 311` o `clientId === 2134`
- ✅ Si el usuario no es uno de estos clientes, Hotjar **no se carga** (no afecta rendimiento)
- ✅ El script se carga dinámicamente después de verificar el `clientId` del localStorage
- ✅ Si el usuario hace login como cliente 311 o 2134, Hotjar se carga automáticamente

## Verificación:

1. Inicia sesión como cliente con `clientId = 311` o `clientId = 2134`
2. Abre la consola del navegador (F12)
3. Deberías ver: `"Hotjar habilitado para cliente 311"` o `"Hotjar habilitado para cliente 2134"`
4. En la pestaña Network, deberías ver una solicitud a `hotjar.com`

## Notas:

- El Site ID se obtiene de la configuración de Hotjar
- La variable `NEXT_PUBLIC_` es necesaria para que Next.js la exponga al cliente
- Si no configuras el Site ID, Hotjar simplemente no se cargará (no causará errores)

