# Auditoría de Diseño Visual — Sinergia Security

**Fecha:** 2026-06-19  
**Lente aplicado:** Anti-Slop Frontend / design-taste-frontend  
**Modo:** Redesign-Preserve (la identidad de marca se preserva, se proponen mejoras evolutivas)

---

## Design Read

> "Leyendo como: sitio de marketing corporativo de seguridad ejecutiva para audiencia B2B premium (ejecutivos, empresas en Ecuador), con lenguaje visual dark tech / premium corporativo, leaning toward una identidad visual propia oscura con accent primario ambiguo entre dorado y azul."

---

## Dials del Estado Actual vs. Objetivo

| Dial | Estado actual | Objetivo | Descripción |
|------|:---:|:---:|---|
| DESIGN_VARIANCE | 5 | 7 | Layouts simétricos; mejorar con composición asimétrica |
| MOTION_INTENSITY | 4 | 5 | Ken Burns + CSS transitions; añadir hover physics y scroll reveal |
| VISUAL_DENSITY | 5 | 5 | Mantener 80px entre secciones; simplificar el hero |

---

## 1. Sistema de Color — Crisis de identidad dual

### 1.1 Dos paletas en conflicto simultáneo

El proyecto tiene los restos de una paleta original **dorada** que nunca fue eliminada al migrar a **azul**. Ambas coexisten en producción:

| Fuente | Color | Valor | Dónde aparece |
|--------|-------|-------|---------------|
| CSS variable (actual) | Azul primario | `#90C2E3` | `--primary-gold`, toda la UI declarativa |
| Hardcoded (legacy gold) | Dorado original | `rgba(229,198,67,…)` | Hover navbar, cert badges, stat boxes |
| Hardcoded (legacy gold) | Dorado oscuro | `rgba(163,142,49,…)` | Emergency box footer, stat backgrounds |
| CSS variable inexistente | Sin definir | `var(--primary-blue)` | [src/app/pages/contacto/contacto.component.scss](src/app/pages/contacto/contacto.component.scss) |

**Impacto visible:** Hover en navbar = golden glow. Glow en botones = azul. Badges de certificaciones = gold. Focus en inputs = referencia a variable que no existe (fallback al browser, sin glow). El usuario no lo nota conscientemente, pero siente que el sitio no es "de una pieza".

### 1.2 Nomenclatura de variables — confusión semántica

```scss
/* src/styles.scss — estado actual */
--primary-gold: #90C2E3;       /* nombre dice "gold", valor es AZUL */
--primary-gold-dark: #2F6BA8;  /* nombre dice "gold dark", valor es AZUL OSCURO */
--text-gold: #487FC0;          /* nombre dice "gold", valor es AZUL LINK */
```

Cualquier desarrollador que lee `--primary-gold` asume `#E5C643` (el dorado del CLAUDE.md). Encuentra azul. Esta inconsistencia se propaga a cada nuevo componente.

### 1.3 Dark backgrounds — demasiado grises

```scss
--dark-primary: #4f4f4f;    /* Gris medio — ratio con blanco: ~5.8:1 ✓ pero sin profundidad */
--bg-dark: #2C2F36;         /* Gris oscuro — solo en footer */
```

El `#1A1D23` mencionado en CLAUDE.md como "Dark background" **no existe como variable CSS**. El navbar y la sección About usan `#4f4f4f` que es un gris medio, no un verdadero oscuro. La sensación de "premium dark tech" se pierde porque el fondo es demasiado claro.

### 1.4 Propuesta de sistema de color coherente

**Decisión primero:** elegir entre dorado o azul como accent primario. No ambos.

**Opción A — Azul de acero (mantener azul, limpiar dorado):**
```scss
--surface-base: #1A1D23;        /* dark background real */
--surface-elevated: #22262E;    /* cards sobre dark */
--surface-light: #F8F9FA;       /* secciones claras */
--accent: #487FC0;              /* azul de acero — el #90C2E3 es demasiado claro */
--accent-hover: #2F6BA8;
--accent-glow: rgba(72, 127, 192, 0.25);
--text-primary: #FFFFFF;
--text-secondary: rgba(255,255,255,0.75);
--text-muted: #8A8D94;
--border: rgba(255,255,255,0.08);
```

**Opción B — Dorado (restaurar el brand original, limpiar el azul):**
```scss
--surface-base: #1A1D23;
--surface-elevated: #22262E;
--accent: #E5C643;              /* gold real del brand */
--accent-hover: #C9A832;
--accent-glow: rgba(229,198,67,0.25);
```

**Recomendación:** Opción A (azul), ya que el 70% del código ya usa azul en CSS variables. La limpieza es menor. El dorado legacy solo está en hardcoded values que se eliminan.

### 1.5 Regla de alternancia de fondos de sección

Propuesta de sistema declarado:

| Sección | Fondo | Lógica |
|---------|-------|--------|
| Hero | `--surface-base` dark | Impacto, máximo contraste |
| Servicios | `--surface-light` | Respiro, contenido de productos |
| About | `--surface-elevated` dark | Vuelve al tono corporativo |
| Cobertura | `--surface-light` | Datos claros en mapa |
| Testimonios | `--surface-base` dark | Peso y credibilidad |
| Team | `--surface-light` | Apertura, fotografías |
| Contact CTA | gradient dark | Llamada a acción final |
| Footer | `--surface-elevated` | Cierre del sitio |

Alternancia dark/light deliberada, no arbitraria.

---

## 2. Tipografía — Poppins funcional pero invisible

### 2.1 Fuente sin personalidad de marca

```css
font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

Poppins es la segunda fuente más usada en websites corporativos latinoamericanos. Para una firma de seguridad ejecutiva de élite, no comunica autoridad ni diferenciación.

**Alternativas recomendadas (una, no todas):**

| Fuente | Carácter | Implementación |
|--------|----------|----------------|
| **Cabinet Grotesk** | Geométrica con presencia, legible en display | `@fontsource/cabinet-grotesk` |
| **Outfit** | Moderna, clara, profesional | Google Fonts, `font-display: swap` |
| **Geist** | Techno-clean, precisa | `@vercel/fonts` o self-hosted |
| Poppins (mantener) | Redonda, accesible | Ya instalada |

Si se mantiene Poppins, al menos corregir los problemas de pesos.

### 2.2 Exceso de font-weights

Se usan 5 pesos en el mismo proyecto: `400 / 600 / 700 / 800 / 900`. Un sistema tipográfico limpio usa 3.

**Sistema propuesto:**

```scss
/* Solo tres pesos */
$weight-regular: 400;   /* body copy */
$weight-medium: 600;    /* labels, nav items, subtítulos */
$weight-bold: 800;      /* headlines, CTAs */

/* El 900 solo para el número grande en hero stats — considerarlo */
```

El peso 700 (`font-weight: 700`) puede eliminarse — entre 600 y 800 hay suficiente jerarquía.

### 2.3 Escalas tipográficas — ceilings cortos

```scss
h1: clamp(2.5rem, 5vw, 4rem);  /* desktop 1440px: 5vw = 72px, pero capped en 4rem = 64px */
```

En pantallas grandes, el h1 siempre se muestra a 64px (4rem) — conservador para un hero. El cap podría subir a `5rem` (80px) para dar más presencia visual en desktop wide.

### 2.4 Vertical text en hero — uso no estándar de tipografía

El texto `"SOLUCIONES INTEGRALES DE SEGURIDAD"` rotado 90° en el lateral izquierdo del hero es un recurso de agencia/portfolio. Para una empresa B2B de seguridad, este elemento:
- No añade información nueva (ya está en el headline)
- Puede distraer del mensaje principal
- Se oculta en tablet/mobile (pierde su función)

Recomendación: Evaluar si comunica algo. Si se mantiene, usarlo para un dato diferente (año de fundación, número de certificaciones, etc.).

---

## 3. Hero — Sobrecarga visual

### 3.1 Conteo de elementos activos

El hero actual tiene **11 elementos visuales** en el viewport simultáneo:

| # | Elemento | Tipo |
|---|----------|------|
| 1 | Texto vertical lateral | Decorativo |
| 2 | Badge "Certificados Internacionalmente" | Pill/eyebrow |
| 3 | Badge "Cobertura Nacional" | Pill/eyebrow |
| 4 | Subtítulo en azul (`slide.subtitle`) | Eyebrow |
| 5 | H1 principal | Headline |
| 6 | Párrafo de descripción | Subtext |
| 7 | CTA primario | CTA |
| 8 | CTA secundario | CTA |
| 9 | 4 stat cards (iconos + números + labels) | Stats |
| 10 | Indicadores del slider (barras) | Navegación |
| 11 | Flechas prev/next | Navegación |

El límite recomendado es **4 elementos de texto**: (1 eyebrow O badge) + (headline) + (subtext, max 20 palabras) + (CTAs).

**Consecuencia:** El hero se convierte en una landing page completa por sí mismo. El ojo del usuario no sabe dónde ir primero. El impacto del headline se diluye.

### 3.2 Propuesta de simplificación del hero

```
Hero simplificado:
┌─────────────────────────────────────────────────┐
│                                                  │
│  [Badge: "Protección Ejecutiva · Ecuador"]       │  ← 1 elemento
│                                                  │
│  Protegemos lo que                               │  ← 2 elemento (headline)
│  más importa.                                    │
│                                                  │
│  Seguridad ejecutiva de élite con 14 años        │  ← 3 elemento (subtext, <20 palabras)
│  de experiencia y cobertura nacional 24/7.       │
│                                                  │
│  [Solicitar Evaluación]  [Conocer Servicios]     │  ← 4 elemento (CTAs)
│                                                  │
│                   ─ ─ ─ ─ ─                     │  ← Indicadores (UI, no content)
└─────────────────────────────────────────────────┘
```

Los **4 stats** (años, clientes, provincias, respuesta) se mueven a la sección "About" inmediatamente debajo del hero, donde refuerzan las cifras de la empresa.

### 3.3 Padding del hero

```scss
/* Actual */
padding-top: 90px; /* offset del navbar */
height: calc(100vh - 90px);
```

El hero usa `100vh` en vez de `min-h-[100dvh]`. En iOS Safari con la barra de dirección visible, esto causa overflow y el CTA queda parcialmente oculto. Cambiar a `min-height: 100dvh`.

---

## 4. CTAs — Intención duplicada

### 4.1 Mapa de intención en la home

| Intent | CTAs encontrados | Labels distintos |
|--------|-----------------|-----------------|
| Contacto/evaluación | 2 | "Solicitar Evaluación" + "Solicitar Evaluación Gratuita" |
| Equipo | 2 | "Nuestro Equipo" + "Conocer Todo el Equipo" |
| Servicios | 2 | "Conocer Nuestros Servicios" + (variación en slides) |
| Empresa | 1 | "Conocer Más" |
| Cobertura | 1 | "Ver Cobertura Completa" |
| Casos | 1 | "Ver Casos de Éxito Completos" |
| Teléfono | 1 | "📞 Llamar Ahora (24/7)" |

Los CTAs con intención duplicada confunden al usuario y diluyen el valor de cada llamada a la acción.

### 4.2 Propuesta de unificación

**Un label por intent, usado consistentemente en toda la página:**

| Intent | Label único | Nota |
|--------|-------------|------|
| Contacto | "Solicitar Evaluación" | Sin "Gratuita" — lo gratuito va en el copy de la sección |
| Equipo | "Ver el Equipo" | Consistente en About y sección de Team |
| Servicios | "Ver Servicios" | Simple, claro |
| Empresa | "Sobre Nosotros" | Más directo que "Conocer Más" |

### 4.3 CTA en hero con emoji

El CTA secundario en el Contact CTA section usa `"📞 Llamar Ahora (24/7)"`. Los emojis en botones:
- No escalan bien en todos los sistemas operativos
- Lucen poco profesionales en contexto B2B premium
- El símbolo de teléfono debería ser un icon SVG de una biblioteca

Reemplazar con: `[icon SVG phone] Llamar Ahora` usando un icono de Phosphor Icons o equivalente.

---

## 5. Layouts — Repetición y anti-patterns

### 5.1 Zigzag cap violado

```
Sección About:      [imagen | contenido]  ← Split 2-col
Sección Coverage:   [mapa | datos]        ← Split 2-col
Sección Contacto:   [info | formulario]   ← Split 2-col
```

3 secciones consecutivas con el mismo layout 2-col split. El límite es 2. La tercera repetición hace que el usuario deje de percibir la estructura visual como intencional.

**Fix:** La sección de Coverage puede romper el patrón con un layout de ancho completo:
```
Mapa de Ecuador a ancho completo con estadísticas debajo en grid horizontal
```

### 5.2 Equal-cards anti-pattern

Dos secciones usan el mismo layout de tarjetas iguales:

```scss
/* Servicios */
grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));

/* Testimonios */
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
```

Visualmente son idénticos. El usuario no siente cambio de ritmo entre secciones.

**Propuesta para Servicios:** Usar un layout bento o zigzag:
```
┌─────────────┬─────────────────┐
│ Protección  │ Seguridad       │
│ Ejecutiva   │ Minera          │
│ (1x1)       │ (1x1)           │
├─────────────┴──────┬──────────┤
│ Transporte Valores │ Crisis   │
│ (2x1 wide)         │ K&R      │
│                    │ (1x1)    │
└────────────────────┴──────────┘
```

**Propuesta para Testimonios:** En lugar de 3 tarjetas iguales, usar 1 testimonio destacado grande + 2 secundarios pequeños:
```
┌───────────────────────────┬────────────┐
│ Testimonio destacado       │ Testimonio │
│ (más texto, foto grande)  │ pequeño    │
│                           ├────────────┤
│                           │ Testimonio │
│                           │ pequeño    │
└───────────────────────────┴────────────┘
```

### 5.3 Section-layout-repetition

Con 8 secciones principales en home, las familias de layout usadas son:

| Familia | Secciones que la usan |
|---------|----------------------|
| 2-col split | About, Coverage, Contact |
| Equal-cards grid | Servicios, Testimonios |
| Full-width + overflow-x | Team carousel |
| Full-width solo | Hero, Contact CTA |

Solo 3 familias activas (4a recomendada). Añadir una 4a familia diferente: **feature-row alternado** (texto centrado + icon grid) o **stats-row horizontal** para romper el ritmo.

---

## 6. Navbar

### 6.1 Altura excesiva

```scss
/* hero.component.scss / navbar.component.scss */
height: 90px; /* desktop */
height: 80px; /* tablet */
height: 64px; /* mobile */
```

La altura máxima recomendada es **80px en desktop**. El navbar actual excede este límite en 10px. La diferencia visual es pequeña pero la regla existe porque alturas mayores consumen viewport innecesariamente.

**Fix:** Reducir a 72px en desktop, conservar 64px en mobile.

### 6.2 Tagline "Security Solutions" redundante

El navbar muestra bajo el logo:
```
SINERGIA
Security Solutions   ← 11px, uppercase, letter-spacing 2px
```

Este tagline no añade información nueva — el hero inmediatamente debajo del navbar ya define la propuesta de valor completa. En un navbar de 90px, ocupa espacio valioso.

**Fix:** Eliminar el tagline del navbar. El logo solo necesita "SINERGIA" para identificar la marca.

### 6.3 Dropdown de servicios inaccesible en mobile

En el menú móvil, "SERVICIOS" es un ítem plano que navega a alguna ruta, sin sub-menú. Los 6 servicios individuales se listan debajo pero como ítems de primer nivel, sin la agrupación del dropdown desktop.

El resultado: 12 ítems en el menú mobile cuando deberían ser 7 (con Servicios expandible).

**Fix:** Implementar acordeón en el menú mobile para el grupo Servicios:
```
INICIO
SERVICIOS [+]
  └ Protección Ejecutiva
  └ Seguridad Minera
  └ ...
EMPRESA
COBERTURA
CASOS
EQUIPO
CONTACTO
```

---

## 7. Emoji — Reemplazos necesarios

El uso de emojis en UI visible (no en marketing copy informal) proyecta informalidad para una marca B2B premium.

### 7.1 Inventario y propuesta de reemplazo

| Emoji | Ubicación | Reemplazo recomendado |
|-------|-----------|----------------------|
| 🛡️ | Hero badge "Certificados" | `Shield` icon (Phosphor) |
| 📍 | Hero badge, footer, contacto | `MapPin` icon (Phosphor) |
| ⭐⭐⭐⭐⭐ | Testimonios (5 por card) | SVG star icons, `fill: var(--accent)` |
| 🚨 | Footer emergency | `Warning` o `SirenSimple` icon (Phosphor) |
| 📧 | Footer, contacto info | `Envelope` icon (Phosphor) |
| 🌐 | Footer | `Globe` icon (Phosphor) |
| 📞 | Contacto info, CTA | `Phone` icon (Phosphor) |
| 🆘 | Contacto — línea K&R | `FirstAid` o `SirenSimple` (Phosphor) |

**Librería recomendada:** `@phosphor-icons/react` o SVG inline de la misma familia.

### 7.2 Stars de testimonios — caso especial

Las 5 estrellas emoji (`⭐⭐⭐⭐⭐`) son el elemento menos profesional del diseño. En un sitio de seguridad ejecutiva, las referencias deberían proyectar autoridad con más sutileza.

**Opción A:** Stars SVG pequeñas, color accent, sin los 5 caracteres repetidos  
**Opción B:** Eliminar las estrellas y enfatizar el nombre/cargo de quien testifica  
**Opción C (recomendada para B2B):** En lugar de estrellas, mostrar el logo de la empresa del testimoniante (con permiso) + el nombre del ejecutivo

---

## 8. Motion — Implementación básica sin library

### 8.1 Estado actual

```typescript
// home.component.ts
setInterval(() => {
  this.scrollByAmount(this.trackVelocity);
}, 30); // 30ms ≈ ~33fps, sin requestAnimationFrame coordinado

// hero.component.ts
setInterval(() => {
  this.nextSlide();
}, 7000); // Sin clearInterval en ngOnDestroy — memory leak
```

```scss
/* styles.scss — animaciones sin prefers-reduced-motion */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 8.2 Problemas

**Sin `prefers-reduced-motion`:** Todos los usuarios, incluidos los que tienen configurado "reducir movimiento" por problemas vestibulares, ven las animaciones completas. Esto es un issue de accesibilidad.

```scss
/* Fix mínimo en styles.scss */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Reveal animations se lanzan en carga:** Las clases `fade-in-up` se aplican inmediatamente al cargar la página. Si el usuario llega con scroll ya hecho (por un link con hash), las secciones inferiores ya están en su estado final y no hay reveal. Necesita `IntersectionObserver`.

**Easing genérico:** Todas las transiciones usan `ease` (equivalente a `cubic-bezier(0.25, 0.1, 0.25, 1)`). Un easing custom como `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) da más personalidad con el mismo código CSS.

```scss
/* Antes */
transition: all 0.3s ease;

/* Después — más presencia, mismo tiempo */
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
```

**Ken Burns en hero:** El efecto `scale(1) → scale(1.1)` en 20s es sutil y correcto para este contexto. Es uno de los pocos elementos de motion bien implementados.

### 8.3 Propuesta de mejora gradual (sin Angular rewrite)

Sin añadir nuevas dependencias, con solo CSS y TypeScript existente:

1. Añadir `prefers-reduced-motion` media query (5 min)
2. Cambiar easing a `cubic-bezier(0.16, 1, 0.3, 1)` globalmente (10 min)
3. Reemplazar clases CSS de reveal con `IntersectionObserver` en un servicio `AnimationService` (2h)
4. Corregir memory leaks de `setInterval` con `clearInterval` en `ngOnDestroy` (30 min)
5. Añadir `hover: transform: translateY(-2px)` en cards de servicio con `transition` (20 min)

---

## 9. Shape System — Sin consistencia declarada

### 9.1 Radios de borde encontrados

| Elemento | Valor actual |
|----------|-------------|
| Tarjetas (testimonios, service) | 15px |
| Inputs del formulario | 10px |
| Dropdown navbar | 8px (estimado) |
| Botones primarios | ~8px (estimado) |
| Slider indicators | 2px |
| Footer emergency box | 10px |
| Cert badges footer | 10px |
| Avatar circular (testimonios) | 50% |

No hay una escala declarada. Los 15px y 10px están hardcodeados en cada componente.

### 9.2 Sistema de radios propuesto

```scss
/* En styles.scss — escala de 3 niveles */
--radius-sm: 6px;    /* inputs, badges pequeños, dropdown items */
--radius-md: 12px;   /* cards, buttons, modales */
--radius-lg: 20px;   /* secciones especiales, hero cards */
--radius-full: 9999px; /* pills, avatares, indicadores circulares */
```

Aplicar consistentemente: inputs → `--radius-sm`, cards → `--radius-md`, avatares → `--radius-full`.

---

## 10. Accesibilidad Visual

*(Complementa los findings funcionales de AUDITORIA.md, solo perspectiva de diseño)*

### 10.1 Contraste en estado actual

| Combinación | Ratio | Estado WCAG AA |
|-------------|-------|----------------|
| Blanco sobre `#4f4f4f` (navbar, about) | ~5.8:1 | ✓ Pasa (normal) |
| Blanco sobre `#2C2F36` (footer) | ~10.7:1 | ✓ Pasa |
| `#A8AAB0` (text-muted) sobre blanco | ~3.8:1 | ✗ Falla AA (4.5:1 req.) |
| `#A8AAB0` sobre `#F8F9FA` | ~3.6:1 | ✗ Falla AA |
| Placeholder `#999` sobre blanco (form) | ~2.8:1 | ✗ Falla AA |
| `#90C2E3` (primary-gold azul) sobre `#4f4f4f` | ~3.4:1 | ✗ Falla AA para texto normal |

### 10.2 Correcciones de contraste mínimas

```scss
/* Fix: text-muted más oscuro */
--text-muted: #6F7278;  /* ratio con blanco: ~6.4:1 ✓ */

/* Fix: placeholder más oscuro */
/* contacto.component.scss */
::placeholder { color: #767980; } /* ratio con blanco: ~4.6:1 ✓ */

/* Fix: primary-gold como azul no pasa sobre gris medio */
/* No usar --primary-gold como color de texto sobre fondos grises */
/* Solo usar como accent (borders, highlights), no como texto informativo */
```

### 10.3 Focus states

Los focus states actuales usan `box-shadow: 0 0 0 3px rgba(144, 194, 227, 0.1)` — el 10% de opacidad es insuficiente para ser visible. El focus ring debe tener al menos `rgba(144, 194, 227, 0.5)` o preferiblemente un `outline: 2px solid var(--accent)`.

---

## 11. Fortalezas de Diseño a Preservar

Antes del roadmap de mejoras, es importante reconocer lo que funciona bien:

1. **Tipografía escalable con `clamp()`** — La escala responsive es correcta y bien razonada
2. **Ken Burns en hero** — Sutil, no distrae del contenido, bien ejecutado
3. **Auto-fit en grids** — El `repeat(auto-fit, minmax(...))` responde bien a distintos viewports
4. **Padding de sección consistente** — Los 80px entre secciones dan suficiente respiración
5. **Hero con slider** — La idea de múltiples slides es válida para mostrar diferentes servicios
6. **Footer estructurado** — El grid de 4 columnas es informativo y organizado
7. **Contraste navbar/footer** — Ambos pasan WCAG AA
8. **Sin em-dashes en contenido visible** — Texto limpio sin ese AI tell
9. **Formulario bien estructurado** — Labels sobre inputs, validación visual, estados de error/éxito
10. **Logo + tagline en navbar** — Identidad consistente en toda la navegación

---

## 12. Roadmap de Mejoras de Diseño

### Semana 1 — Correcciones críticas de identidad visual

| # | Tarea | Archivo(s) | Impacto |
|---|-------|-----------|---------|
| 1 | Unificar paleta: renombrar variables y eliminar hardcoded gold | [src/styles.scss](src/styles.scss) + todos los `.scss` | Alto |
| 2 | Definir `--surface-base: #1A1D23` y aplicar en navbar + about | [src/styles.scss](src/styles.scss), [navbar.component.scss](src/app/components/navbar/navbar.component.scss) | Alto |
| 3 | Corregir contraste de `--text-muted` y placeholders | [src/styles.scss](src/styles.scss), [contacto.component.scss](src/app/pages/contacto/contacto.component.scss) | Alto |
| 4 | Añadir `prefers-reduced-motion` global | [src/styles.scss](src/styles.scss) | Alto |
| 5 | Definir sistema de radios con variables CSS | [src/styles.scss](src/styles.scss) | Medio |
| 6 | Reemplazar emojis de stars en testimonios con SVG | [home.component.html](src/app/pages/home/home.component.html) | Medio |

### Semana 2 — Hero y CTAs

| # | Tarea | Archivo(s) | Impacto |
|---|-------|-----------|---------|
| 7 | Mover las 4 stats del hero a la sección About | [hero.component.html](src/app/components/hero/hero.component.html), [home.component.html](src/app/pages/home/home.component.html) | Alto |
| 8 | Simplificar hero a 4 elementos (badge, h1, subtext, CTAs) | [hero.component.html](src/app/components/hero/hero.component.html) | Alto |
| 9 | Unificar labels de CTAs (1 intent = 1 label en todo el sitio) | Múltiples templates | Medio |
| 10 | Reemplazar `100vh` con `min-height: 100dvh` en hero | [hero.component.scss](src/app/components/hero/hero.component.scss) | Medio |
| 11 | Reducir navbar a 72px desktop, eliminar tagline redundante | [navbar.component.scss](src/app/components/navbar/navbar.component.scss) | Bajo |
| 12 | Reemplazar emojis de contacto/footer con Phosphor SVG icons | [footer.component.html](src/app/components/footer/footer.component.html), [contacto.component.html](src/app/pages/contacto/contacto.component.html) | Medio |

### Semana 3 — Layouts y Motion

| # | Tarea | Archivo(s) | Impacto |
|---|-------|-----------|---------|
| 13 | Rediseñar sección Servicios con layout bento/asimétrico | [home.component.html](src/app/pages/home/home.component.html), [home.component.scss](src/app/pages/home/home.component.scss) | Alto |
| 14 | Rediseñar Testimonios: 1 destacado + 2 secundarios | [home.component.html](src/app/pages/home/home.component.html) | Medio |
| 15 | Romper zigzag en Coverage con layout de mapa full-width | [home.component.html](src/app/pages/home/home.component.html) | Medio |
| 16 | Implementar acordeón en menú mobile para Servicios | [navbar.component.html](src/app/components/navbar/navbar.component.html), [navbar.component.ts](src/app/components/navbar/navbar.component.ts) | Medio |
| 17 | Añadir `IntersectionObserver` para reveal animations | `src/app/services/animation.service.ts` (nuevo) | Medio |
| 18 | Cambiar easing genérico a `cubic-bezier(0.16, 1, 0.3, 1)` | [src/styles.scss](src/styles.scss) | Bajo |
| 19 | Evaluar cambio de fuente Poppins → Cabinet Grotesk o Outfit | [src/styles.scss](src/styles.scss) | Bajo/experimental |

---

## Resumen por Prioridad

| Severidad | Cantidad | Ejemplos clave |
|-----------|----------|---------------|
| **Crítico** | 3 | Crisis dual gold/blue, hero sobrecargado, contraste text-muted |
| **Alto** | 6 | Zigzag cap, CTAs duplicados, emojis profesionales, navbar altura, reduced-motion |
| **Medio** | 7 | Equal-cards anti-pattern, shape system, focus rings, easing, tagline navbar |
| **Bajo** | 4 | Fuente tipográfica, vertical text hero, clamp ceilings, acordeón mobile |

---

*Complemento de [AUDITORIA.md](AUDITORIA.md) — Ver ese documento para issues de seguridad, arquitectura Angular y formularios.*
