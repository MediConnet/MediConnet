# 🚀 Inicio Rápido - DOCALINK (Desarrollo Local)

## ⚡ Pasos para Iniciar

### 1. Backend (Puerto 3000)
```bash
cd ../doca-link-backend
npm run dev
```

### 2. Frontend (Puerto 5174)
```bash
npm run dev
```

### 3. Abrir en el Navegador
```
http://localhost:5174
```

---

## 🔄 Cambiar entre Local y Producción

### Para Desarrollo Local:
Edita `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

### Para Producción:
Edita `.env`:
```env
VITE_API_URL=https://doca-link-backend.onrender.com/api
VITE_NODE_ENV=production
```

**⚠️ Importante:** Reinicia el servidor después de cambiar `.env`

---

## ✅ Verificación Rápida

### Backend está corriendo:
```bash
curl http://localhost:3000/api/health
```

### Frontend está corriendo:
Abre: `http://localhost:5174`

---

## 🐛 Problemas Comunes

### "Cannot connect to backend"
- ✅ Verifica que el backend esté corriendo en puerto 3000
- ✅ Verifica que `.env` tenga `http://localhost:3000/api`
- ✅ Reinicia el frontend después de cambiar `.env`

### "Port 5173 is in use"
- ✅ Vite automáticamente usa el siguiente puerto disponible (5174, 5175, etc.)
- ✅ Revisa la consola para ver qué puerto está usando

### Cambios en `.env` no se aplican
- ✅ Detén el servidor (Ctrl+C)
- ✅ Ejecuta `npm run dev` de nuevo

---

## 📦 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🎨 DOCALINK

- **Nombre:** DOCALINK
- **Tagline:** Conecta tu salud
- **URL Local:** http://localhost:5174
- **URL Producción:** https://mediconnet.com
- **Backend Local:** http://localhost:3000/api
- **Backend Producción:** https://doca-link-backend.onrender.com/api

---

**¡Listo para desarrollar! 🚀**
