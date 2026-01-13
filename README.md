# VestIA - Boutique Inteligente 🛍️

Plataforma web de comercio electrónico con asistente de estilo personalizado e inteligencia artificial.

## 🎯 Descripción

VestIA es una aplicación web moderna que transforma la experiencia de compra en línea mediante la integración de un asistente virtual inteligente. Los usuarios pueden explorar productos, recibir recomendaciones personalizadas basadas en sus preferencias, y analizar imágenes para encontrar prendas similares.

## ✨ Características

- **Catálogo Dinámico**: Productos obtenidos en tiempo real desde DummyJSON API
- **Búsqueda Inteligente**: Encuentra productos por nombre o descripción
- **Filtros Avanzados**: Filtra por categoría, color, talla, ocasión, estilo y precio
- **Asistente Virtual (Lia)**: Chatbot con IA que recomienda productos basándose en preferencias
- **Análisis de Imágenes**: Sube fotos de prendas y recibe recomendaciones similares
- **Carrito de Compras**: Gestión completa con persistencia en localStorage
- **Preferencias de Usuario**: Guarda tus gustos para recomendaciones personalizadas
- **Diseño Responsive**: Optimizado para móviles, tablets y escritorio

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos personalizados y animaciones
- **JavaScript (ES6+)** - Lógica e interactividad
- **Bootstrap 5.3.2** - Framework CSS responsive

### APIs y Servicios
- **DummyJSON API** - Catálogo de productos
- **Google Gemini API** - Inteligencia artificial para chatbot y análisis de imágenes
- **localStorage** - Persistencia de datos del cliente

### Librerías
- **Font Awesome 6.5.1** - Iconos vectoriales
- **Google Fonts** - Tipografías (Playfair Display, Source Sans 3)
- **SweetAlert2** - Alertas y modales elegantes

## 📁 Estructura del Proyecto

```
VestIA-ucab/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   ├── config.js           # Configuración y utilidades
│   ├── products.js         # Gestión de productos y API
│   ├── cart.js             # Carrito de compras
│   ├── filters.js          # Sistema de filtros
│   ├── profile.js          # Preferencias del usuario
│   ├── chatbot.js          # Chatbot con IA
│   └── main.js             # Inicialización principal
└── README.md               # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Visualizar en Línea
Visita la aplicación desplegada en GitHub Pages:
```
https://mqrcoant.github.io/VestIA-ucab/
```

### Opción 2: Ejecutar Localmente

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/mqrcoant/VestIA-ucab.git
   cd VestIA-ucab
   ```

2. **Abrir en el navegador**
   - Abre `index.html` directamente en tu navegador, o
   - Usa un servidor local (recomendado):
   ```bash
   # Con Python 3
   python3 -m http.server 8000
   
   # Con Node.js (npx)
   npx serve
   ```

3. **Acceder a la aplicación**
   - Navegador: `http://localhost:8000`

## 👥 Equipo de Desarrollo

### División de Responsabilidades

- **Carmelo Moschella** (Frontend & Catálogo)
  - `index.html` - Estructura semántica
  - `css/styles.css` - Diseño y estilos
  - `js/products.js` - Integración con DummyJSON API

- **Marco Delgado** (Lógica de Negocio)
  - `js/cart.js` - Carrito de compras
  - `js/filters.js` - Sistema de filtros
  - `js/profile.js` - Preferencias del usuario

- **Stefano Libertella** (Inteligencia Artificial)
  - `js/chatbot.js` - Chatbot con Gemini API
  - Análisis de imágenes con IA

## 🔧 Configuración

### API Keys
Para habilitar las funcionalidades de IA, necesitas una API key de Google Gemini:

1. Obtén tu API key en: https://ai.google.dev/
2. Configura la key en `js/config.js`:
   ```javascript
   window.VestiaApp.config = {
     geminiApiKey: "TU_API_KEY_AQUI"
   };
   ```

> ⚠️ **Nota de Seguridad**: En producción, las API keys deben manejarse mediante variables de entorno o un backend intermedio.

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 **Móviles**: 320px - 767px
- 📱 **Tablets**: 768px - 1023px
- 💻 **Desktop**: 1024px+

## 🎨 Paleta de Colores

```css
--vestia-cream: #f7f1e8    /* Fondo principal */
--vestia-ink: #1f1b16      /* Texto y botones */
--vestia-gold: #c39a62     /* Acentos y hover */
--vestia-line: #d9cdbf     /* Bordes */
--vestia-white: #ffffff    /* Tarjetas */
```

## 📝 Funcionalidades Implementadas

### ✅ Catálogo de Productos
- [x] Carga dinámica desde DummyJSON API
- [x] Paginación (9 productos por página)
- [x] Búsqueda por nombre/descripción
- [x] Filtros por categoría
- [x] Estados de carga (skeleton screens)
- [x] Manejo de errores

### ✅ Interfaz de Usuario
- [x] Diseño moderno y elegante
- [x] Animaciones sutiles
- [x] Navegación intuitiva
- [x] Formularios con validación
- [x] Responsive design

### 🔄 En Desarrollo (Marco & Stefano)
- [ ] Carrito de compras funcional
- [ ] Sistema de filtros completo
- [ ] Preferencias persistentes
- [ ] Chatbot con Gemini API
- [ ] Análisis de imágenes

## 🧪 Testing

Para probar la aplicación:

1. **Catálogo**: Verifica que los productos se carguen desde la API
2. **Búsqueda**: Prueba buscar "shirt", "phone", etc.
3. **Responsive**: Prueba en diferentes tamaños de pantalla
4. **Navegación**: Verifica que todos los enlaces funcionen

## 📚 Documentación de APIs

- **DummyJSON**: https://dummyjson.com/docs/products
- **Google Gemini**: https://ai.google.dev/docs
- **Bootstrap 5**: https://getbootstrap.com/docs/5.3/

## 🤝 Contribuir

Este es un proyecto académico para la materia de Programación Orientada a la Web (NRC: 15832).

### Workflow de Git

```bash
# Crear rama para tu feature
git checkout -b feature/nombre-feature

# Hacer commits descriptivos
git commit -m "feat: descripción del cambio"

# Push a tu rama
git push origin feature/nombre-feature

# Crear Pull Request en GitHub
```

## 📄 Licencia

Proyecto académico - Universidad Católica Andrés Bello (UCAB)  
Programación Orientada a la Web - 2026

## 👨‍🏫 Profesor

Raikjars Afrikano

---

**VestIA** - Tu estilista personal 24/7 ✨