/* ============================================
   PROYECTO SEMANA 01 - FICHA DE INFORMACIÓN INTERACTIVA
   VERSIÓN COMPLETA ADAPTADA A DOMINIO: SUBASTAS INMOBILIARIAS
   ============================================ */

// ============================================
// OBJETO DE DATOS DE TU DOMINIO
// ============================================
const entityData = {
  name: 'Plataforma de Subastas',
  description: 'Plataforma web donde los usuariosPlataforma online donde los usuarios pueden ofertar por propiedades inmobiliarias de forma sencilla y segura. pueden pujar por propiedades y proyectos inmobiliarios.',
  identifier: 'SUB-001',

  contact: {
    email: 'soporte@subastas.com',
    phone: '+57 300 000 0000',
    location: 'Colombia'
  },

  items: [
    { name: 'Viviendas', level: 90 },
    { name: 'Lotes', level: 75 },
    { name: 'Locales Comerciales', level: 65 },
    { name: 'Obras en Construcción', level: 50 },
    { name: 'Oficinas', level: 60 },
    { name: 'Proyectos Especiales', level: 40 }
  ],

  links: [
    { platform: 'Web', url: '#', icon: '🌐' },
    { platform: 'Facebook', url: '#', icon: '📘' },
    { platform: 'Instagram', url: '#', icon: '📸' }
  ],

  stats: {
    totalProperties: 120,
    activeAuctions: 30,
    rating: 4.6,
    specialProjects: 10
  }
};

// ============================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================
const userName = document.getElementById('userName');
const userTitle = document.getElementById('userTitle');
const userLocation = document.getElementById('userLocation');
const userBio = document.getElementById('userBio');

const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');

const skillsList = document.getElementById('skillsList');
const toggleSkillsBtn = document.getElementById('toggleSkills');

const socialLinks = document.getElementById('socialLinks');
const statsContainer = document.getElementById('stats');

const themeToggle = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyEmailBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ============================================
// RENDERIZAR INFORMACIÓN BÁSICA
// ============================================
const renderBasicInfo = () => {
  const {
    name,
    description,
    contact: { email, phone, location }
  } = entityData;

  userName.textContent = name;
  userTitle.textContent = 'Sistema de Subastas Online';
  userLocation.textContent = `📍 ${location}`;
  userBio.textContent = description;

  userEmail.textContent = email;
  userPhone.textContent = phone;
};

// ============================================
// RENDERIZAR LISTA DE ITEMS
// ============================================
let showingAllItems = false;

const renderItems = (showAll = false) => {
  const { items } = entityData;
  const itemsToShow = showAll ? items : items.slice(0, 4);

  const itemsHtml = itemsToShow.map(item => {
    const { name, level } = item;
   return `
  <div class="skill-item">
    <div class="skill-name">${name}</div>
    <div class="skill-level">
      <span>${level}%</span>
      <div class="skill-bar">
        <div class="skill-bar-fill" style="width: ${level}%"></div>
      </div>
    </div>
  </div>
`;

  }).join('');

  skillsList.innerHTML = itemsHtml;
};

// ============================================
// RENDERIZAR ENLACES
// ============================================
const renderLinks = () => {
  const { links } = entityData;

  const linksHtml = links.map(link => `
    <a href="${link.url}" target="_blank" class="social-link">
      ${link.icon} ${link.platform}
    </a>
  `).join('');

  socialLinks.innerHTML = linksHtml;
};

// ============================================
// RENDERIZAR ESTADÍSTICAS
// ============================================
const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Total Propiedades', value: stats.totalProperties },
    { label: 'Subastas Activas', value: stats.activeAuctions },
    { label: 'Rating', value: stats.rating },
    { label: 'Proyectos Especiales', value: stats.specialProjects }
  ];

  const statsHtml = statsArray.map(stat => `
    <div class="stat-item">
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    </div>
  `).join('');

  statsContainer.innerHTML = statsHtml;
};

// ============================================
// CAMBIO DE TEMA
// ============================================
const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

// ============================================
// FUNCIONALIDAD COPIAR INFORMACIÓN
// ============================================
const copyInfo = () => {
  const { name, description, contact } = entityData;
  const infoText = `
${name}
${description}
Contacto: ${contact?.email ?? 'No disponible'}
`.trim();

  navigator.clipboard.writeText(infoText);
  showToast('¡Información copiada al portapapeles!');
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================
const showToast = message => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// ============================================
// MOSTRAR/OCULTAR ITEMS
// ============================================
const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleSkillsBtn.textContent = showingAllItems ? 'Mostrar menos' : 'Mostrar más';
};

// ============================================
// INICIALIZAR LA APLICACIÓN
// ============================================
const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log('✅ Aplicación inicializada correctamente');

  themeToggle.addEventListener('click', toggleTheme);
  copyBtn.addEventListener('click', copyInfo);
  toggleSkillsBtn.addEventListener('click', handleToggleItems);
};

document.addEventListener('DOMContentLoaded', init);
