// ============================================
// PROYECTO SEMANA 02 - GESTOR DE PROPIEDADES
// ============================================

// ============================================
// ESTADO GLOBAL
// ============================================

let items = [];
let editingItemId = null;

// ============================================
// CATEGORÍAS Y PRIORIDADES
// ============================================

const CATEGORIES = {
  house: { name: 'Casa', emoji: '🏠' },
  apartment: { name: 'Apartamento', emoji: '🏢' },
  land: { name: 'Terreno', emoji: '🌍' },
  commercial: { name: 'Local Comercial', emoji: '🏬' },
};

const PRIORITIES = {
  high: { name: 'Alta', color: '#ef4444' },
  medium: { name: 'Media', color: '#f59e0b' },
  low: { name: 'Baja', color: '#22c55e' },
};

// ============================================
// PERSISTENCIA
// ============================================

const loadItems = () =>
  JSON.parse(localStorage.getItem('realEstateProperties') ?? '[]');

const saveItems = itemsToSave =>
  localStorage.setItem('realEstateProperties', JSON.stringify(itemsToSave));

// ============================================
// CRUD - CREAR
// ============================================

const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(),
    name: itemData.name ?? '',
    description: itemData.description ?? '',
    category: itemData.category ?? 'house',
    priority: itemData.priority ?? 'medium',
    price: itemData.price ?? 0,
    location: itemData.location ?? '',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    ...itemData,
  };

  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

// ============================================
// CRUD - ACTUALIZAR
// ============================================

const updateItem = (id, updates = {}) => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );

  saveItems(updatedItems);
  return updatedItems;
};

// ============================================
// CRUD - ELIMINAR
// ============================================

const deleteItem = id => {
  const filteredItems = items.filter(item => item.id !== id);
  saveItems(filteredItems);
  return filteredItems;
};

// ============================================
// TOGGLE ACTIVO
// ============================================

const toggleItemActive = id => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );

  saveItems(updatedItems);
  return updatedItems;
};

const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// ============================================
// FILTROS
// ============================================

const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'all') return itemsToFilter;
  if (status === 'active') return itemsToFilter.filter(i => i.active);
  if (status === 'inactive') return itemsToFilter.filter(i => !i.active);
  return itemsToFilter;
};

const filterByCategory = (itemsToFilter, category = 'all') =>
  category === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.category === category);

const filterByPriority = (itemsToFilter, priority = 'all') =>
  priority === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.priority === priority);

const searchItems = (itemsToFilter, query = '') => {
  if (!query.trim()) return itemsToFilter;

  const term = query.toLowerCase();

  return itemsToFilter.filter(
    i =>
      i.name.toLowerCase().includes(term) ||
      (i.description ?? '').toLowerCase().includes(term) ||
      (i.location ?? '').toLowerCase().includes(term)
  );
};

const applyFilters = (itemsToFilter, filters = {}) => {
  const {
    status = 'all',
    category = 'all',
    priority = 'all',
    search = '',
  } = filters;

  let result = filterByStatus(itemsToFilter, status);
  result = filterByCategory(result, category);
  result = filterByPriority(result, priority);
  result = searchItems(result, search);

  return result;
};

const applyCurrentFilters = () => {
  const status = document.getElementById('filter-status').value;
  const category = document.getElementById('filter-category').value;
  const priority = document.getElementById('filter-priority').value;
  const search = document.getElementById('search-input').value;

  return applyFilters(items, { status, category, priority, search });
};

// ============================================
// ESTADÍSTICAS
// ============================================

const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(i => i.active).length;
  const inactive = total - active;

  return { total, active, inactive };
};

// ============================================
// RENDER
// ============================================

const getCategoryEmoji = category =>
  CATEGORIES[category]?.emoji ?? '🏠';

const renderItem = item => {
  const {
    id,
    name,
    description,
    category,
    priority,
    price,
    location,
    active,
    createdAt,
  } = item;

  return `
    <div class="item ${active ? '' : 'inactive'}" data-item-id="${id}">
      <input type="checkbox" class="item-checkbox" ${active ? 'checked' : ''}>

      <div class="item-content">
        <h3>${getCategoryEmoji(category)} ${name}</h3>
        <p>${description ?? ''}</p>
        <p><strong>Ubicación:</strong> ${location}</p>
        <p><strong>Precio:</strong> $${price}</p>
        <p><strong>Prioridad:</strong> ${PRIORITIES[priority]?.name}</p>
        <small>Creado: ${new Date(createdAt).toLocaleDateString()}</small>
      </div>

      <div class="item-actions">
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </div>
    </div>
  `;
};

const renderItems = itemsToRender => {
  const list = document.getElementById('item-list');
  const empty = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;
};

// ============================================
// FORMULARIO
// ============================================

const resetForm = () => {
  document.getElementById('item-form').reset();
  editingItemId = null;
  document.getElementById('submit-btn').textContent = 'Crear';
  document.getElementById('cancel-btn').style.display = 'none';
};

const handleFormSubmit = e => {
  e.preventDefault();

  const name = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category = document.getElementById('item-category').value;
  const priority = document.getElementById('item-priority').value;
  const price = document.getElementById('item-price').value;
  const location = document.getElementById('item-location').value;

  if (!name) return alert('El nombre es obligatorio');

  const itemData = { name, description, category, priority, price, location };

  items = editingItemId
    ? updateItem(editingItemId, itemData)
    : createItem(itemData);

  resetForm();
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

// ============================================
// ACCIONES SOBRE ITEMS
// ============================================

const handleItemToggle = id => {
  items = toggleItemActive(id);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const handleItemDelete = id => {
  if (!confirm('¿Eliminar esta propiedad?')) return;
  items = deleteItem(id);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const handleItemEdit = id => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('item-name').value = item.name;
  document.getElementById('item-description').value = item.description;
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-priority').value = item.priority;
  document.getElementById('item-price').value = item.price;
  document.getElementById('item-location').value = item.location;

  editingItemId = id;
  document.getElementById('submit-btn').textContent = 'Actualizar';
  document.getElementById('cancel-btn').style.display = 'inline-block';
};

// ============================================
// EVENT LISTENERS
// ============================================

const attachEventListeners = () => {
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);

  document.getElementById('item-list').addEventListener('click', e => {
    const itemElement = e.target.closest('.item');
    if (!itemElement) return;

    const id = parseInt(itemElement.dataset.itemId);

    if (e.target.classList.contains('item-checkbox')) handleItemToggle(id);
    if (e.target.classList.contains('btn-delete')) handleItemDelete(id);
    if (e.target.classList.contains('btn-edit')) handleItemEdit(id);
  });

  document.getElementById('filter-status').addEventListener('change', () => renderItems(applyCurrentFilters()));
  document.getElementById('filter-category').addEventListener('change', () => renderItems(applyCurrentFilters()));
  document.getElementById('filter-priority').addEventListener('change', () => renderItems(applyCurrentFilters()));
  document.getElementById('search-input').addEventListener('input', () => renderItems(applyCurrentFilters()));

  document.getElementById('clear-inactive').addEventListener('click', () => {
    if (!confirm('¿Eliminar todas las propiedades no disponibles?')) return;
    items = clearInactive();
    renderItems(applyCurrentFilters());
    renderStats(getStats(items));
  });
};

// ============================================
// INIT
// ============================================

const init = () => {
  items = loadItems();
  renderItems(items);
  renderStats(getStats(items));
  attachEventListeners();
  console.log('Aplicación iniciada correctamente');
};

document.addEventListener('DOMContentLoaded', init);
