# Auditoría Técnica — Sinergia Security

**Fecha:** 2026-06-19  
**Proyecto:** Angular 17 + Node.js/Express — Sitio web corporativo de seguridad ejecutiva  
**Alcance:** Seguridad, arquitectura frontend, UI/UX, rendimiento y accesibilidad

---

## Resumen Ejecutivo

El proyecto tiene una base sólida: standalone components de Angular 17 bien configurados, lazy loading correcto en rutas, integración funcional con Google Sheets/Gmail y un diseño visual atractivo. Sin embargo, presenta **deudas técnicas significativas** en tres áreas:

1. **Seguridad crítica** — Las credenciales de producción están expuestas en el repositorio Git
2. **Arquitectura** — Componentes monolíticos de 1000+ líneas y duplicación masiva de datos
3. **Accesibilidad** — Carencias en aria-labels, alt texts y atributos ARIA en modales

La acción más urgente es **revocar y regenerar las credenciales de Google OAuth2** inmediatamente.

| Área | Crítico | Alto | Medio | Bajo |
|------|---------|------|-------|------|
| Seguridad (Backend) | 2 | 3 | 3 | 4 |
| Arquitectura Frontend | 4 | 4 | 2 | 0 |
| UI/UX y Diseño | 0 | 3 | 5 | 1 |
| Formularios | 0 | 0 | 2 | 0 |
| **Total** | **6** | **10** | **12** | **5** |

---

## 1. Seguridad — Backend (`src/app/sinergia-backend/`)

### 🔴 CRÍTICO: Credenciales expuestas en el repositorio Git

**Archivo:** `src/app/sinergia-backend/.env`

El archivo `.env` con credenciales reales está versionado en Git. Cualquier persona con acceso al repo puede:
- Acceder y enviar emails desde la cuenta Gmail configurada
- Leer y modificar el Google Spreadsheet de clientes
- Usar el refresh token OAuth2 para suplantar la identidad de la aplicación

**Acciones requeridas:**
1. Revocar **ahora** el refresh token en [Google Cloud Console → OAuth Clients](https://console.cloud.google.com/apis/credentials)
2. Revocar el Client Secret y generar uno nuevo
3. Verificar si el historial de Git expone el archivo: `git log --all --full-history -- "**/.env"`
4. Si hay historial, limpiar con `git filter-repo --path src/app/sinergia-backend/.env --invert-paths`
5. Asegurarse que `.gitignore` incluya `src/app/sinergia-backend/.env`

```bash
# Verificar que .env está ignorado:
echo "src/app/sinergia-backend/.env" >> .gitignore
```

Crear `src/app/sinergia-backend/.env.example`:
```env
PORT=3000
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GMAIL_USER=your_gmail@gmail.com
NOTIFICATION_EMAIL=team@empresa.com
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
ALLOWED_ORIGINS=http://localhost:4200,https://tudominio.com
NODE_ENV=development
```

---

### 🔴 CRÍTICO: CORS abierto a todos los orígenes

**Archivo:** `src/app/sinergia-backend/server.js`, línea ~25

```js
// ❌ Actual
app.use(cors({ origin: '*' }));

// ✅ Fix
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));
```

Con `origin: '*'` cualquier sitio web puede hacer POST a los endpoints, habilitando CSRF y abuso del servicio de email.

---

### 🟠 ALTO: Rate limiting solo en `/api/contact`

**Archivo:** `src/app/sinergia-backend/server.js`, línea ~34

El endpoint `/api/cotizacion` no tiene rate limiting, permitiendo inundar el servidor con solicitudes y envíos de email sin restricción.

```js
// ❌ Actual
app.use('/api/contact', limiter);

// ✅ Fix
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/contact', limiter);
app.use('/api/cotizacion', limiter);
```

---

### 🟠 ALTO: Mensajes de error exponen detalles internos

**Archivo:** `src/app/sinergia-backend/server.js`, líneas ~288-292

Los errores de Google Sheets y Gmail se incluyen en la respuesta al cliente:

```js
// ❌ Actual — expone infraestructura
errors.push(`Email: ${emailError.message}`);
res.json({ errores: errors });

// ✅ Fix — log interno, respuesta genérica
console.error('[EMAIL ERROR]', emailError);
res.status(500).json({ message: 'Error al procesar la solicitud. Intente más tarde.' });
```

---

### 🟠 ALTO: Variables de entorno no validadas al inicio

Si falta una variable requerida, el servidor inicia pero falla en runtime con mensajes confusos.

```js
// ✅ Agregar al inicio de server.js, antes de app.listen()
const requiredVars = [
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN',
  'GMAIL_USER', 'NOTIFICATION_EMAIL', 'GOOGLE_SPREADSHEET_ID'
];
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.error(`ERROR: Variable de entorno requerida no configurada: ${v}`);
    process.exit(1);
  }
});
```

---

### 🟡 MEDIO: Health check expone configuración sensible

**Archivo:** `src/app/sinergia-backend/server.js`, líneas ~718-729

`GET /api/health` retorna `GMAIL_USER` sin autenticación. Simplificar:

```js
// ✅ Fix
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

---

### 🟡 MEDIO: Límite de body de 10 MB excesivo

```js
// ❌ Actual
app.use(express.json({ limit: '10mb' }));

// ✅ Fix
app.use(express.json({ limit: '1mb' }));
```

---

### 🟡 MEDIO: Log de datos personales en consola

```js
// ❌ Actual — loguea email del cliente
console.log('Datos recibidos:', { nombre: data.nombreCompleto, email: data.email });

// ✅ Fix — solo loguear ticket ID y timestamp
console.log(`[${new Date().toISOString()}] Solicitud recibida - Ticket: ${ticketId}`);
```

---

### 🟢 BAJO: Ticket ID no criptográficamente seguro

```js
// ❌ Actual
const ticketId = `SIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ✅ Fix — instalar uuid: npm install uuid
const { v4: uuidv4 } = require('uuid');
const ticketId = `SIN-${uuidv4().split('-')[0].toUpperCase()}`;
```

---

### 🟢 BAJO: Transporter de Nodemailer creado por request

El transporter OAuth2 se instancia en cada llamada. Debería crearse una sola vez al iniciar el servidor para reutilizar tokens y reducir latencia.

---

## 2. Arquitectura Frontend

### 🔴 CRÍTICO: URLs de API hardcodeadas

**Archivos:** [`src/app/services/service.ts`](src/app/services/service.ts), [`src/app/services/cotizacion.service.ts`](src/app/services/cotizacion.service.ts)

```ts
// ❌ Actual
private apiUrl = 'http://localhost:3000/api/contact';

// ✅ Fix — usar environments
// src/environments/environment.ts
export const environment = { production: false, apiUrl: 'http://localhost:3000' };

// src/environments/environment.prod.ts
export const environment = { production: true, apiUrl: 'https://api.tudominio.com' };

// En el servicio:
import { environment } from '../../environments/environment';
private apiUrl = `${environment.apiUrl}/api/contact`;
```

Configurar en `angular.json` bajo `fileReplacements` para que el build de producción use `environment.prod.ts`.

---

### 🔴 CRÍTICO: Memory leaks — `setInterval` sin cleanup

**Archivo:** [`src/app/components/hero/hero.component.ts`](src/app/components/hero/hero.component.ts)

```ts
// ❌ Actual — el interval nunca se cancela
ngOnInit() {
  setInterval(() => this.nextSlide(), 7000);
}

// ✅ Fix
private autoPlayId!: ReturnType<typeof setInterval>;

ngOnInit() {
  this.autoPlayId = setInterval(() => this.nextSlide(), 7000);
}

ngOnDestroy() {
  clearInterval(this.autoPlayId);
}
```

El mismo patrón aplica al auto-scroll del carrusel de equipo en [`src/app/pages/home/home.component.ts`](src/app/pages/home/home.component.ts). Cada visita a la página crea un nuevo interval sin cancelar el anterior.

---

### 🔴 CRÍTICO: Variables CSS con nombres incorrectos

**Archivo:** [`src/styles.scss`](src/styles.scss)

Las variables de color tienen nombres de "dorado" pero contienen valores azules, en contradicción con la documentación del proyecto:

```scss
/* ❌ Actual — confuso y contradictorio */
--primary-gold: #90C2E3;        /* es AZUL */
--primary-gold-dark: #2F6BA8;   /* es azul oscuro */
--primary-gold-light: #BDD9F0;  /* es azul claro */
--text-gold: #487FC0;           /* es azul */

/* ✅ Fix — opción A: renombrar a blue */
--primary-blue: #90C2E3;
--primary-blue-dark: #2F6BA8;
--primary-blue-light: #BDD9F0;
--text-blue: #487FC0;

/* ✅ Fix — opción B: corregir al dorado real del brand (#E5C643) */
--primary-gold: #E5C643;
--primary-gold-dark: #C9A832;
--primary-gold-light: #F0D87A;
```

Además, algunos componentes (`cases.component.ts`) usan `--primary-blue` y `--primary-blue-dark` que **no existen** en `styles.scss`, causando fallback a valores por defecto del navegador.

---

### 🔴 CRÍTICO: `getCompositeImage()` siempre retorna hardcoded

**Archivo:** [`src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts`](src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts), línea ~516

```ts
// ❌ Actual — calcula fileName pero lo ignora
getCompositeImage(vehicleId: string, uniformId: string, armamentoId?: string): string {
  const armaSuffix = armamentoId ? `_${armamentoId}` : '_sin-arma';
  const fileName = `${vehicleId}_${uniformId}${armaSuffix}.png`;
  return 'assets/resumen/hash_camu_corta.png'; // ← siempre retorna esto
}

// ✅ Fix A — retornar el fileName calculado (si los assets existen)
return `assets/resumen/${fileName}`;

// ✅ Fix B — eliminar la función y hardcodear el único asset disponible directamente en el template
```

---

### 🟠 ALTO: Componentes monolíticos (>1000 líneas)

| Archivo | Líneas | Problema |
|---------|--------|---------|
| [`src/app/pages/home/home.component.ts`](src/app/pages/home/home.component.ts) | 1027 | Template inline + carrusel + equipo + servicios + testimonios |
| [`src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts`](src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts) | 1027 | Configurador de vehículos + uniformes + armas + formulario |
| [`src/app/pages/team/team.component.ts`](src/app/pages/team/team.component.ts) | ~1400 | Template HTML completamente inline |
| [`src/app/pages/cases/cases.component.ts`](src/app/pages/cases/cases.component.ts) | ~1100 | Template HTML completamente inline |
| [`src/app/pages/coverage/coverage.component.ts`](src/app/pages/coverage/coverage.component.ts) | ~900 | Template HTML completamente inline |

**Pasos de refactorización:**

1. Extraer templates inline a archivos `.html` separados (cambio inmediato, bajo riesgo):
   ```
   team.component.ts → team.component.ts + team.component.html
   cases.component.ts → cases.component.ts + cases.component.html
   coverage.component.ts → coverage.component.ts + coverage.component.html
   ```

2. Dividir `proteccion-ejecutiva` en sub-componentes:
   ```
   proteccion-ejecutiva/
   ├── proteccion-ejecutiva.component.ts  (orquestador)
   ├── vehicle-selector/
   ├── uniform-selector/
   └── weapon-selector/
   ```

---

### 🟠 ALTO: Duplicación masiva de datos

Los mismos datos se definen en múltiples lugares con valores inconsistentes:

**Miembros del equipo:**
- [`home.component.ts`](src/app/pages/home/home.component.ts) líneas ~46-75: 4 miembros con nombres
- [`team.component.ts`](src/app/pages/team/team.component.ts) líneas ~1234-1383: lista diferente con otros nombres para los mismos cargos

**Testimonios:**
- Definidos en `home`, `cases`, `seguridad-minera` y `crisis-kr` — 14 testimonios en 4 archivos sin estructura común

**Fix:** Crear `src/app/data/` con fuentes de datos centralizadas:
```
src/app/data/
├── team.data.ts
├── testimonials.data.ts
└── services.data.ts
```

---

### 🟠 ALTO: Páginas stub sin contenido

**Archivos:**
- [`src/app/pages/servicios/academy/academy.component.ts`](src/app/pages/servicios/academy/academy.component.ts) — 36 líneas, template vacío
- [`src/app/pages/servicios/transporte-valores/transporte-valores.component.ts`](src/app/pages/servicios/transporte-valores/transporte-valores.component.ts) — 28 líneas, template vacío

Estas páginas están accesibles via rutas pero no muestran contenido. Agregar al menos una sección "Próximamente" o completar el contenido.

---

### 🟠 ALTO: Interfaces TypeScript duplicadas

Las siguientes interfaces se definen por separado en múltiples componentes:

| Interfaz | Definida en |
|----------|------------|
| `TeamMember` | `team.component.ts`, `crisis-kr.component.ts` |
| `Feature` | `seguridad-minera.component.ts`, `crisis-kr.component.ts`, `proteccion-ejecutiva.component.ts` |
| `Testimonial` | `home.component.ts`, `seguridad-minera.component.ts`, `crisis-kr.component.ts` |

**Fix:** Crear `src/app/models/`:
```
src/app/models/
├── team-member.model.ts
├── testimonial.model.ts
├── feature.model.ts
└── service-offering.model.ts
```

---

### 🟡 MEDIO: Sin interceptor HTTP centralizado

No existe manejo de errores HTTP ni timeout centralizados. Cada componente maneja errores por separado (o no los maneja).

**Fix:** Crear `src/app/interceptors/http-error.interceptor.ts`:
```ts
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    timeout(15000),
    catchError((error: HttpErrorResponse) => {
      console.error('[HTTP Error]', error.status, req.url);
      return throwError(() => error);
    })
  );
};
```

Registrar en `app.config.ts`:
```ts
provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor]))
```

---

## 3. UI/UX y Diseño

### 🟠 ALTO: Footer duplicado en línea

**Archivo:** [`src/app/pages/servicios/seguridad-minera/seguridad-minera.component.html`](src/app/pages/servicios/seguridad-minera/seguridad-minera.component.html), líneas ~259-343

El HTML completo del footer está copiado inline en esta página en lugar de usar el componente:

```html
<!-- ❌ Actual — 80 líneas de HTML de footer duplicado -->
<footer class="footer">
  ...
</footer>

<!-- ✅ Fix — una línea -->
<app-footer></app-footer>
```

---

### 🟠 ALTO: Breadcrumb duplicado en 3 páginas

El mismo bloque HTML + CSS de breadcrumb se repite en `coverage`, `cases` y `team`.

**Fix:** Crear `src/app/components/breadcrumb/breadcrumb.component.ts`:
```ts
@Input() items: { label: string; route?: string }[] = [];
```

```html
<!-- Uso -->
<app-breadcrumb [items]="[{label:'Inicio', route:'/'}, {label:'Cobertura Nacional'}]"></app-breadcrumb>
```

---

### 🟠 ALTO: `navigateTo()` duplicado en 6+ componentes

El método `navigateTo(route: string) { this.router.navigate([route]); }` se copia en cada componente.

**Fix:** Los componentes pueden inyectar `Router` directamente en el template con el `routerLink` directive, que ya está disponible — no hace falta un método wrapper. Eliminar el método y reemplazar `(click)="navigateTo('/ruta')"` con `routerLink="/ruta"` en los templates.

---

### 🟡 MEDIO: Imágenes sin lazy loading

El 100% de las imágenes del proyecto se cargan eagerly. En páginas con 10+ imágenes (home, team) esto impacta el tiempo de carga inicial.

**Fix:** Agregar `loading="lazy"` a todas las imágenes que no estén en el viewport inicial:
```html
<img src="..." alt="..." loading="lazy">
```

Las imágenes del hero/viewport inicial deben mantener `loading="eager"` (o sin atributo, que es el default).

---

### 🟡 MEDIO: Botones de carrusel sin `aria-label`

**Archivo:** [`src/app/pages/home/home.component.html`](src/app/pages/home/home.component.html)

Los botones de navegación de slides solo contienen símbolos `←` `→` sin descripción para lectores de pantalla:

```html
<!-- ❌ Actual -->
<button (click)="prevSlide()">←</button>
<button (click)="nextSlide()">→</button>

<!-- ✅ Fix -->
<button (click)="prevSlide()" aria-label="Diapositiva anterior">←</button>
<button (click)="nextSlide()" aria-label="Diapositiva siguiente">→</button>
```

---

### 🟡 MEDIO: Modales sin atributos ARIA

Los modales de proteccion-ejecutiva (selección de vehículo, uniforme) no tienen roles ARIA ni cierre con tecla Escape.

```html
<!-- ✅ Fix -->
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Seleccionar Vehículo</h2>
  ...
</div>
```

```ts
// ✅ Agregar en el componente
@HostListener('document:keydown.escape')
onEscapeKey() {
  this.closeModal();
}
```

---

### 🟡 MEDIO: Breakpoints no estandarizados

Los componentes usan diferentes valores de breakpoints: `1200px`, `1024px`, `768px`, `480px`, `430px` mezclados sin consistencia.

**Fix:** Definir variables en `styles.scss` y usarlas en todos los componentes:
```scss
// Variables Sass (no CSS custom properties, para usarlas en @media)
$bp-mobile: 480px;
$bp-tablet: 768px;
$bp-laptop: 1024px;
$bp-desktop: 1440px;
```

---

### 🟡 MEDIO: Alt text ausente en imágenes de equipo y testimonios

Imágenes en secciones de equipo y testimonios carecen de atributo `alt` descriptivo. Para imágenes decorativas usar `alt=""`, para imágenes de personas usar su nombre.

---

### 🟡 MEDIO: Imágenes externas sin fallback de error

URLs de Cloudinary (logo) y Unsplash (team members) no tienen manejo de error si fallan:

```html
<!-- ✅ Fix -->
<img [src]="member.image" [alt]="member.name" 
     (error)="onImageError($event)" loading="lazy">
```

```ts
onImageError(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/placeholder-avatar.png';
}
```

---

### 🟢 BAJO: Menú mobile no muestra submenú de servicios

Al tocar "SERVICIOS" en el menú móvil, no se despliega el submenú de las 6 categorías. El usuario no puede navegar directamente a páginas de servicio desde el menú móvil.

---

## 4. Validación de Formularios

### 🟡 MEDIO: Validación de teléfono rechaza formatos válidos

**Archivos:** [`src/app/pages/contacto/contacto.component.ts`](src/app/pages/contacto/contacto.component.ts), [`src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts`](src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.ts)

El patrón `/^[0-9]{10}$/` rechaza:
- `0999 999 999` (con espacios)
- `+593 99 999 9999` (con código de país)
- `099-999-9999` (con guiones)

**Fix:** Sanitizar el input antes de validar (eliminar espacios/guiones) o usar un patrón más flexible:
```ts
// Opción: sanitizar en el servicio antes de enviar
telefono: telefono.replace(/[\s\-\+]/g, '')
```

---

### 🟡 MEDIO: Botón de cotización sin deshabilitar cuando formulario es inválido

**Archivo:** [`src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.html`](src/app/pages/servicios/proteccion-ejecutiva/proteccion-ejecutiva.component.html)

```html
<!-- ❌ Actual — no verifica cotizacionForm.invalid -->
<button [disabled]="enviandoCotizacion || cotizacionEnviada">

<!-- ✅ Fix -->
<button [disabled]="cotizacionForm.invalid || enviandoCotizacion || cotizacionEnviada">
```

---

## 5. Tests

### 🟡 MEDIO: Cobertura de tests es 0%

`ng test` está configurado con Karma pero no existen archivos `.spec.ts`. Los formularios y servicios HTTP son los candidatos más importantes para tests unitarios.

**Tests prioritarios:**
```
src/app/services/service.spec.ts           — ContactService.enviarSolicitud()
src/app/services/cotizacion.service.spec.ts — CotizacionService.enviarCotizacionCompleta()
src/app/pages/contacto/contacto.component.spec.ts — validaciones del formulario
```

---

## Roadmap de Implementación

### Semana 1 — Seguridad y estabilidad (Crítico)

| # | Tarea | Archivo(s) |
|---|-------|-----------|
| 1 | Revocar y regenerar credenciales Google OAuth2 | `.env`, Google Cloud Console |
| 2 | Crear `.env.example` y actualizar `.gitignore` | `src/app/sinergia-backend/` |
| 3 | Restringir CORS a orígenes explícitos | `server.js` |
| 4 | Aplicar rate limiting a `/api/cotizacion` | `server.js` |
| 5 | Crear `src/environments/environment.ts` y `.prod.ts` | `src/environments/` |
| 6 | Corregir memory leaks en `hero.component.ts` | `hero.component.ts` |
| 7 | Renombrar variables CSS `--primary-gold` → `--primary-blue` | `styles.scss` + todos los componentes |
| 8 | Corregir o eliminar `getCompositeImage()` | `proteccion-ejecutiva.component.ts` |

### Semana 2 — Arquitectura y mantenibilidad

| # | Tarea | Archivo(s) |
|---|-------|-----------|
| 9 | Crear `src/app/models/` con interfaces compartidas | `models/*.model.ts` |
| 10 | Extraer templates de `team`, `cases`, `coverage` a `.html` | 3 componentes |
| 11 | Centralizar datos en `src/app/data/` | `data/*.data.ts` |
| 12 | Crear interceptor HTTP | `interceptors/http-error.interceptor.ts` |
| 13 | Crear componente `<app-breadcrumb>` | `components/breadcrumb/` |
| 14 | Reemplazar footer duplicado en `seguridad-minera` | `seguridad-minera.component.html` |
| 15 | Reemplazar `(click)="navigateTo()"` con `routerLink` | Múltiples componentes |

### Semana 3 — UI/UX y calidad

| # | Tarea | Archivo(s) |
|---|-------|-----------|
| 16 | Agregar `loading="lazy"` a imágenes | Todos los templates |
| 17 | Agregar `aria-label` a botones de carrusel | `home.component.html`, `hero.component.html` |
| 18 | Agregar `role="dialog"` y Escape handler a modales | `proteccion-ejecutiva.component.*` |
| 19 | Estandarizar breakpoints con variables Sass | `styles.scss` + todos los `.scss` |
| 20 | Completar páginas `academy` y `transporte-valores` | 2 componentes |
| 21 | Agregar alt texts descriptivos a imágenes de personas | Todos los templates |
| 22 | Arreglar submenú de servicios en menú mobile | `navbar.component.*` |

---

## Verificación Post-Implementación

```bash
# 1. Levantar ambos servidores
npm start
cd src/app/sinergia-backend && npm run dev

# 2. Verificar build de producción sin errores de budget
npm run build

# 3. Lighthouse audit (abrir Chrome DevTools → Lighthouse)
# Objetivo: 90+ en Performance, Accessibility, Best Practices

# 4. Verificar formulario de contacto end-to-end:
#    - Ir a /contacto
#    - Llenar y enviar formulario
#    - Verificar email recibido y registro en Google Sheets

# 5. Verificar que no hay memory leaks:
#    - Ir a home → navegar a otra página → volver a home (3 veces)
#    - En DevTools → Performance → Heap, verificar que no crece indefinidamente
```
