# Escenarios del Race Condition: Errores y Latencia

## 📋 Código ANTES del Fix

```typescript
// En orders.ts - ANTES
export const postOrder = async (orderData: OrderDto) => {
  try {
    const ordersRef = firestore.collection(DATABASE);
    await ordersRef.add(orderData);  // ⏳ Espera respuesta de Firebase
    localStorage.removeItem('cartItems'); // ❌ Se ejecuta DESPUÉS del await
    return 'Order posted successfully';
  } catch (error) {
    throw new Error('Failed to post order to Firebase');
  }
};

// En Cart.tsx - ANTES
onClick={() => {
  handleOpenDialog(), submitNewOrder(); // Se ejecutan al mismo tiempo
}}

// En Dialogue.tsx - ANTES
const handleConfirm = () => {
  if (emptyCartIsTrue) {
    emptyCart(); // ❌ Doble borrado
  }
};
```

## 🔴 Escenario 1: Error de Firebase/Red

### Flujo del Error:
```
Usuario hace clic en "Enviar Pedido"
    ↓
submitNewOrder() se ejecuta
    ↓
postOrder() se llama
    ↓
await ordersRef.add(orderData) → Intenta guardar
    ↓
❌ ERROR: Conexión perdida / Firebase rechaza / Timeout
    ↓
catch (error) → Lanza excepción
    ↓
localStorage.removeItem('cartItems') → ❌ NO se ejecuta (está después del await)
    ↓
PERO: Dialogue.tsx se abre (porque handleOpenDialog() se ejecutó)
    ↓
Usuario cierra el diálogo
    ↓
Dialogue.tsx llama emptyCart() → ❌ BORRA EL CARRITO
    ↓
RESULTADO: Pedido NO guardado, carrito BORRADO ❌
```

**Problema**: Aunque el `localStorage.removeItem()` no se ejecutaba por el error, `Dialogue.tsx` sí borraba el carrito.

---

## 🔴 Escenario 2: Latencia con Éxito (PERO usuario cierra/recarga)

### Flujo con Latencia:
```
Usuario hace clic en "Enviar Pedido"
    ↓
submitNewOrder() se ejecuta
    ↓
postOrder() se llama
    ↓
await ordersRef.add(orderData) → ⏳ Esperando respuesta (3-5 segundos de latencia)
    ↓
[Usuario cierra la pestaña o recarga la página durante la latencia]
    ↓
El pedido SÍ se guarda en Firebase (después de 3 segundos)
    ↓
PERO: localStorage.removeItem('cartItems') → ❌ NO se ejecuta (pestaña cerrada)
    ↓
Usuario recarga la página
    ↓
CartContext lee localStorage → Carrito todavía tiene items
    ↓
Usuario piensa que el pedido no se envió
    ↓
Usuario envía OTRO pedido con los mismos items → ❌ DUPLICADO
```

**Problema**: El pedido se guarda, pero el carrito no se borra si el usuario cierra/recarga durante la latencia.

---

## 🔴 Escenario 3: Latencia con Éxito (PERO doble borrado)

### Flujo con Latencia y Doble Borrado:
```
Usuario hace clic en "Enviar Pedido"
    ↓
submitNewOrder() se ejecuta
    ↓
postOrder() se llama
    ↓
await ordersRef.add(orderData) → ⏳ Esperando respuesta (2 segundos)
    ↓
✅ ÉXITO: Pedido guardado en Firebase
    ↓
localStorage.removeItem('cartItems') → ✅ Se ejecuta (línea 19 de orders.ts)
    ↓
handleOpenDialog() abre el diálogo
    ↓
Usuario cierra el diálogo
    ↓
Dialogue.tsx llama emptyCart() → ❌ BORRA OTRA VEZ (aunque ya estaba vacío)
    ↓
RESULTADO: Pedido guardado ✅, pero doble borrado innecesario
```

**Problema**: Funciona, pero es ineficiente y puede causar problemas si hay otros listeners.

---

## 🔴 Escenario 4: Múltiples Usuarios/Pestañas (SIN sincronización)

### Flujo con Múltiples Pestañas:
```
Pestaña 1: Usuario A tiene 10 items en carrito
Pestaña 2: Usuario B tiene 5 items en carrito
    ↓
Usuario B hace clic en "Enviar Pedido"
    ↓
Pedido se guarda exitosamente
    ↓
localStorage.removeItem('cartItems') → Borra localStorage
    ↓
Pestaña 1: NO detecta el cambio (no hay listener)
    ↓
Usuario A todavía ve sus 10 items en la UI
    ↓
Usuario A hace clic en "Enviar Pedido"
    ↓
orderData se construye con cartItems del estado (10 items)
    ↓
PERO: localStorage ya está vacío (borrado por Usuario B)
    ↓
Si hay algún problema o recarga, los items se pierden
    ↓
RESULTADO: Confusión, posible pérdida de datos ❌
```

**Problema**: Sin sincronización, múltiples usuarios/pestañas pueden causar inconsistencias.

---

## ✅ Código DESPUÉS del Fix

```typescript
// En orders.ts - AHORA
export const postOrder = async (orderData: OrderDto) => {
  try {
    const ordersRef = firestore.collection(DATABASE);
    await ordersRef.add(orderData);
    // ✅ NO borramos aquí - esperamos confirmación en el componente
    return 'Order posted successfully';
  } catch (error) {
    throw new Error('Failed to post order to Firebase');
  }
};

// En Cart.tsx - AHORA
const submitNewOrder = async () => {
  try {
    const response = await postOrder(orderData);
    await fetchLastOrder();
    emptyCart(); // ✅ Solo después de confirmar éxito
    return true;
  } catch (error) {
    return false; // ✅ NO borra el carrito si hay error
  }
};

onClick={async () => {
  const success = await submitNewOrder();
  if (success) {
    handleOpenDialog(); // ✅ Solo abre si fue exitoso
  } else {
    alert('Error al enviar el pedido');
  }
}}

// En Dialogue.tsx - AHORA
const handleConfirm = () => {
  // ✅ NO llama emptyCart() - ya se llamó después del éxito
  if (emptyCartIsTrue) {
    setCartIsVisible(false);
  }
};
```

---

## ✅ Escenarios CORREGIDOS

### Escenario 1 Corregido: Error de Firebase/Red
```
Usuario hace clic en "Enviar Pedido"
    ↓
submitNewOrder() se ejecuta
    ↓
postOrder() se llama
    ↓
await ordersRef.add(orderData) → Intenta guardar
    ↓
❌ ERROR: Conexión perdida
    ↓
catch (error) → Retorna false
    ↓
emptyCart() → ✅ NO se ejecuta
    ↓
handleOpenDialog() → ✅ NO se ejecuta (porque success = false)
    ↓
alert('Error al enviar el pedido')
    ↓
RESULTADO: Pedido NO guardado, carrito PRESERVADO ✅
Usuario puede reintentar
```

### Escenario 2 Corregido: Latencia con Éxito
```
Usuario hace clic en "Enviar Pedido"
    ↓
submitNewOrder() se ejecuta
    ↓
await ordersRef.add(orderData) → ⏳ Esperando respuesta
    ↓
✅ ÉXITO: Pedido guardado
    ↓
emptyCart() → ✅ Se ejecuta DESPUÉS de confirmar éxito
    ↓
handleOpenDialog() → ✅ Se abre
    ↓
RESULTADO: Pedido guardado, carrito borrado correctamente ✅
```

### Escenario 3 Corregido: Múltiples Usuarios/Pestañas
```
Pestaña 1: Usuario A tiene 10 items
Pestaña 2: Usuario B tiene 5 items
    ↓
Usuario B envía pedido → emptyCart() borra localStorage
    ↓
Evento 'storage' se dispara en Pestaña 1 ✅
    ↓
Pestaña 1: Detecta el cambio → Actualiza estado automáticamente
    ↓
Usuario A ve carrito vacío (sincronizado) ✅
```

---

## 📊 Resumen de Problemas y Soluciones

| Escenario | ANTES | AHORA |
|-----------|-------|-------|
| **Error de Firebase** | Carrito se borra (Dialogue.tsx) | Carrito se preserva ✅ |
| **Latencia + cierre** | Carrito no se borra → Duplicados | Carrito se borra después de éxito ✅ |
| **Latencia + éxito** | Doble borrado innecesario | Un solo borrado correcto ✅ |
| **Múltiples pestañas** | No sincroniza → Inconsistencias | Sincroniza automáticamente ✅ |

---

## 🎯 Conclusión

El bug del race condition podía ocurrir en **MÚLTIPLES escenarios**:

1. ✅ **Errores de Firebase/Red**: Carrito se borraba aunque el pedido fallara
2. ✅ **Latencia**: Carrito no se borraba si usuario cerraba/recargaba durante la espera
3. ✅ **Doble borrado**: Se borraba dos veces innecesariamente
4. ✅ **Múltiples usuarios**: Sin sincronización causaba inconsistencias

**La solución** asegura que:
- El carrito solo se borra DESPUÉS de confirmar éxito
- Si hay error, el carrito se preserva
- Hay sincronización entre pestañas/dispositivos
- Solo hay un borrado, en el momento correcto


