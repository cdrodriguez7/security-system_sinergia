# 🛡️ SINERGIA SECURITY - Sistema Web Angular

## Descripción
Sitio web profesional para Sinergia Security, empresa de seguridad ejecutiva y gestión de riesgo crítico en Ecuador.

## 🎨 Diseño
Basado en el template Rigardi Security con paleta de colores:
- **Primario:** #E5C643 (Oro/Amarillo)
- **Oscuro:** #1A1D23 (Gris carbón)
- **Textos:** #FFFFFF / #1A1D23

## 📦 Estructura del Proyecto

```
sinergia-security/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/           # Navegación principal
│   │   │   ├── hero/             # Hero con slider
│   │   │   ├── services/         # Sección de servicios
│   │   │   ├── about/            # Sobre nosotros
│   │   │   ├── coverage/         # Cobertura nacional
│   │   │   ├── cases/            # Casos de éxito
│   │   │   ├── team/             # Equipo
│   │   │   ├── contact/          # Formulario contacto
│   │   │   └── footer/           # Footer
│   │   ├── services/             # Servicios Angular
│   │   ├── models/               # Modelos de datos
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/                   # Imágenes y recursos
│   └── styles.scss               # Estilos globales
├── angular.json
├── package.json
└── tsconfig.json
```

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Instalación

```bash
# Instalar dependencias
npm install

# Instalar Angular CLI globalmente (si no lo tienes)
npm install -g @angular/cli

# Iniciar servidor de desarrollo
ng serve

# Construir para producción
ng build --configuration production
```

### Scripts Disponibles

```bash
npm start              # Servidor de desarrollo (http://localhost:4200)
npm run build          # Build de producción
npm run watch          # Build con watch mode
npm test               # Ejecutar tests
```

## 🎯 Características Implementadas

### ✅ Fase 1 - Estructura Base
- [x] Configuración de Angular 17
- [x] Sistema de estilos globales con paleta Rigardi
- [x] Navegación fija con dropdown
- [x] Hero section con slider automático
- [x] Componente de navegación responsive
- [x] Animaciones y transiciones

### 📋 Pendiente de Implementar
- [ ] Componente de Servicios
- [ ] Componente About Us
- [ ] Mapa de Cobertura Nacional
- [ ] Galería de Casos de Éxito
- [ ] Sección de Equipo
- [ ] Formulario de Contacto con validación
- [ ] Footer completo
- [ ] Integración con backend/API
- [ ] Sistema de rutas (multi-página)
- [ ] Optimización SEO
- [ ] Tests unitarios

## 📱 Responsive Design
- Desktop: 1920px+
- Laptop: 1024px - 1919px
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🔧 Configuración

### Modificar Colores
Editar variables en `src/styles.scss`:
```scss
:root {
  --primary-gold: #E5C643;
  --dark-primary: #1A1D23;
  // ...
}
```

### Añadir Nuevas Secciones
1. Crear componente: `ng generate component components/nueva-seccion`
2. Importar en el componente principal
3. Añadir al routing si es necesario

## 📞 Información de Contacto
Para modificar información de contacto, editar:
- `src/app/components/navbar/navbar.component.html`
- `src/app/components/contact/contact.component.ts`

## 🎨 Personalización de Imágenes
Colocar imágenes en `src/assets/images/`:
- hero-1.jpg (1920x1080)
- hero-2.jpg (1920x1080)
- hero-3.jpg (1920x1080)
- logo.png (transparente)

## 📄 Licencia
Proyecto privado para Sinergia Security Ecuador

## 👥 Desarrollado por
[Tu nombre/empresa]

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
