// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let currentUser = null;
let favorites = [];
let currentPage = 1;
const itemsPerPage = 6;

// ========== ИНИЦИАЛИЗАЦИЯ ДАННЫХ (ОНЛАЙН-ФОТО) ==========
function initData() {
    if (!localStorage.getItem('properties')) {
        localStorage.setItem('properties', JSON.stringify([
            { 
                id: 1, 
                address: 'г. Саратов, ул. Московская 12', 
                type: 'квартира', 
                totalArea: 45.2, 
                priceSale: 3200000, 
                priceRent: null, 
                status: 'свободно', 
                description: 'Центр, отличное состояние',
                imageUrl: 'https://i.ibb.co/5hNXvYy0/1.jpg'
            },
            { 
                id: 2, 
                address: 'г. Саратов, пр. Столыпина 8-78', 
                type: 'квартира', 
                totalArea: 60.8, 
                priceSale: 4500000, 
                priceRent: 28000, 
                status: 'свободно', 
                description: 'Новостройка',
                imageUrl: 'https://i.ibb.co/v47CmsGF/1.webp'
            },
            { 
                id: 3, 
                address: 'Саратовский р-н, Юбилейный, Дачная 5', 
                type: 'частный дом', 
                totalArea: 120, 
                priceSale: 5800000, 
                priceRent: 35000, 
                status: 'свободно', 
                description: 'Участок 6 соток, баня',
                imageUrl: 'https://i.ibb.co/5hNXvYy0/1.jpg'
            },
            { 
                id: 4, 
                address: 'г. Энгельс, ул. Ленина 22-12', 
                type: 'квартира', 
                totalArea: 38.5, 
                priceSale: 2100000, 
                priceRent: 15000, 
                status: 'свободно', 
                description: 'Студия, мебель',
                imageUrl: 'https://i.ibb.co/v47CmsGF/1.webp'
            },
            { 
                id: 5, 
                address: 'г. Саратов, ул. Танкистов 45-34', 
                type: 'квартира', 
                totalArea: 70.2, 
                priceSale: 5200000, 
                priceRent: 32000, 
                status: 'продано', 
                description: 'Евроремонт',
                imageUrl: 'https://i.ibb.co/5hNXvYy0/1.jpg'
            }
        ]));
    }
    if (!localStorage.getItem('clients')) localStorage.setItem('clients', JSON.stringify([{ id:1, fullName:'Иван Иванов', phone:'+7-900-111-11-11' }, { id:2, fullName:'Анна Петрова', phone:'+7-900-222-22-22' }]));
    if (!localStorage.getItem('agents')) localStorage.setItem('agents', JSON.stringify([{ id:1, fullName:'Алексей Петров', company:'Этажи', rating:4.6 }, { id:2, fullName:'Ирина Сидорова', company:'Инком', rating:4.9 }]));
    if (!localStorage.getItem('transactions')) localStorage.setItem('transactions', '[]');
    if (!localStorage.getItem('reviews')) localStorage.setItem('reviews', '[]');
    if (!localStorage.getItem('favorites')) localStorage.setItem('favorites', '[]');
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id:1, fullName:'Администратор', email:'admin@example.com', password:'123', role:'admin' },
            { id:2, fullName:'Агент Петров', email:'agent@example.com', password:'123', role:'agent' },
            { id:3, fullName:'Пользователь', email:'user@example.com', password:'123', role:'user' }
        ]));
    }
}

// ============================================================
// ========== ИЗБРАННОЕ ==========================================
// ============================================================
function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fid => fid !== id);
    } else {
        favorites.push(id);
    }
    saveFavorites();
    updateFavCounter();
    renderProperties();
}

function updateFavCounter() {
    const count = favorites.length;
    const btn = document.getElementById('favoritesBtn');
    if (btn) btn.innerHTML = `${count} ⭐`;
}

// ============================================================
// ========== МОДАЛЬНОЕ ОКНО ИЗБРАННОГО ========================
// ============================================================
function renderFavoritesModal() {
    const container = document.getElementById('favoritesModalBody');
    const allProps = JSON.parse(localStorage.getItem('properties'));
    const favProps = allProps.filter(p => favorites.includes(p.id));
    
    if (favProps.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-star" style="font-size: 3rem; color: #ffc107; opacity: 0.3;"></i>
                <p class="mt-3">У вас пока нет избранных объектов</p>
                <p class="small text-muted">Добавьте объекты в избранное, нажав на звёздочку ⭐ на карточке</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="row g-3">';
    favProps.forEach(p => {
        const priceShow = p.priceSale ? `${p.priceSale.toLocaleString()} ₽` : (p.priceRent ? `${p.priceRent.toLocaleString()} ₽/мес` : '—');
        const statusColor = p.status === 'свободно' ? 'success' : (p.status === 'продано' ? 'danger' : 'warning');
        html += `
            <div class="col-md-6">
                <div class="card property-card h-100" onclick="showDetailsModal(${p.id})" style="cursor: pointer;">
                    <div class="card-img-glow" style="height:120px;">
                        ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-home"></i>'}
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h6 class="fw-bold">${p.address.split(',')[0]}</h6>
                            <span style="color: #ffc107;">★</span>
                        </div>
                        <p class="small text-secondary">${p.address}</p>
                        <p><span class="badge bg-${statusColor}">${p.status}</span> <span class="ms-2">${p.type}</span></p>
                        <p class="small"><i class="fas fa-chart-area"></i> ${p.totalArea} м² | ${priceShow}</p>
                        <button class="btn btn-sm btn-outline-danger mt-1" onclick="event.stopPropagation(); toggleFavorite(${p.id}); renderFavoritesModal();">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ============================================================
// ========== ФИЛЬТРАЦИЯ ========================================
// ============================================================
function getFilteredProperties() {
    let props = JSON.parse(localStorage.getItem('properties'));
    const type = document.getElementById('filterType').value;
    const status = document.getElementById('filterStatus').value;
    const priceMin = parseFloat(document.getElementById('filterPriceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('filterPriceMax').value) || Infinity;
    const addr = document.getElementById('filterAddress').value.toLowerCase();
    return props.filter(p => {
        if (type && p.type !== type) return false;
        if (status && p.status !== status) return false;
        let price = p.priceSale || p.priceRent || 0;
        if (price < priceMin || price > priceMax) return false;
        if (addr && !p.address.toLowerCase().includes(addr)) return false;
        return true;
    });
}

// ============================================================
// ========== РЕНДЕРИНГ =========================================
// ============================================================
function renderProperties() {
    loadFavorites();
    const filtered = getFilteredProperties();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage-1)*itemsPerPage;
    const pageItems = filtered.slice(start, start+itemsPerPage);
    const container = document.getElementById('propertiesList');
    container.innerHTML = '';
    pageItems.forEach(p => {
        const isFav = favorites.includes(p.id);
        const priceShow = p.priceSale ? `${p.priceSale.toLocaleString()} ₽` : (p.priceRent ? `${p.priceRent.toLocaleString()} ₽/мес` : '—');
        const statusColor = p.status === 'свободно' ? 'success' : (p.status === 'продано' ? 'danger' : 'warning');
        let buttonsHtml = '';
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'agent')) {
            buttonsHtml = `<div class="mt-2 d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); openPropertyModal(${p.id})"><i class="fas fa-edit"></i> Ред.</button>
                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteProperty(${p.id})"><i class="fas fa-trash"></i> Уд.</button>
                ${p.status === 'свободно' ? `<button class="btn btn-sm btn-outline-success" onclick="event.stopPropagation(); openTransactionModal(${p.id})"><i class="fas fa-handshake"></i> Сделка</button>` : ''}
            </div>`;
        } else if (currentUser && currentUser.role === 'user') {
            buttonsHtml = `<div class="mt-2"><button class="btn btn-sm btn-outline-secondary w-100" onclick="event.stopPropagation(); alert('Свяжитесь с агентом')"><i class="fas fa-phone-alt"></i> Запрос</button></div>`;
        }
        container.innerHTML += `
            <div class="col">
                <div class="card property-card h-100" onclick="showDetailsModal(${p.id})">
                    <div class="card-img-glow">
                        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.address}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-home"></i>'}
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="fw-bold">${p.address.split(',')[0]}</h5>
                            <span class="favorite-star" onclick="event.stopPropagation(); toggleFavorite(${p.id})">${isFav ? '★' : '☆'}</span>
                        </div>
                        <p class="text-secondary">${p.address}</p>
                        <p><span class="badge bg-${statusColor}">${p.status}</span> <span class="ms-2">${p.type}</span></p>
                        <p><i class="fas fa-chart-area"></i> ${p.totalArea} м² | ${priceShow}</p>
                        <p class="small text-muted">${p.description?.substring(0,70)}...</p>
                        ${buttonsHtml}
                    </div>
                </div>
            </div>
        `;
    });
    let pagHtml = '<ul class="pagination">';
    for(let i=1;i<=totalPages;i++) pagHtml += `<li class="page-item ${i===currentPage?'active':''}"><a class="page-link" href="#" onclick="changePage(${i});return false;">${i}</a></li>`;
    pagHtml += '</ul>';
    document.getElementById('pagination').innerHTML = pagHtml;
}

function changePage(p) { currentPage = p; renderProperties(); }

// ============================================================
// ========== CRUD ОБЪЕКТОВ ====================================
// ============================================================
function openPropertyModal(id=null) {
    if(id) {
        const props = JSON.parse(localStorage.getItem('properties'));
        const p = props.find(x=>x.id===id);
        if(p) {
            document.getElementById('propertyModalTitle').innerText = 'Редактировать';
            document.getElementById('propertyId').value = p.id;
            document.getElementById('propAddress').value = p.address;
            document.getElementById('propType').value = p.type;
            document.getElementById('propArea').value = p.totalArea;
            document.getElementById('propPriceSale').value = p.priceSale||'';
            document.getElementById('propPriceRent').value = p.priceRent||'';
            document.getElementById('propStatus').value = p.status;
            document.getElementById('propDescription').value = p.description||'';
            document.getElementById('propImageUrl').value = p.imageUrl||'';
        }
    } else {
        document.getElementById('propertyModalTitle').innerText = 'Новый объект';
        document.getElementById('propertyForm').reset();
        document.getElementById('propertyId').value = '';
    }
    new bootstrap.Modal(document.getElementById('propertyModal')).show();
}

function saveProperty() {
    const id = document.getElementById('propertyId').value;
    const newProp = {
        id: id ? parseInt(id) : Date.now(),
        address: document.getElementById('propAddress').value.trim(),
        type: document.getElementById('propType').value,
        totalArea: parseFloat(document.getElementById('propArea').value) || 0,
        priceSale: parseFloat(document.getElementById('propPriceSale').value) || null,
        priceRent: parseFloat(document.getElementById('propPriceRent').value) || null,
        status: document.getElementById('propStatus').value,
        description: document.getElementById('propDescription').value,
        imageUrl: document.getElementById('propImageUrl').value || ''
    };
    if(!newProp.address) { alert('Введите адрес'); return; }
    let props = JSON.parse(localStorage.getItem('properties'));
    if(id) {
        const idx = props.findIndex(p=>p.id==id);
        if(idx!==-1) props[idx]=newProp;
    } else props.push(newProp);
    localStorage.setItem('properties', JSON.stringify(props));
    bootstrap.Modal.getInstance(document.getElementById('propertyModal')).hide();
    renderProperties();
}

function deleteProperty(id) {
    if(confirm('Удалить объект?')) {
        let props = JSON.parse(localStorage.getItem('properties'));
        props = props.filter(p=>p.id!==id);
        localStorage.setItem('properties', JSON.stringify(props));
        renderProperties();
    }
}

// ============================================================
// ========== ОТЗЫВЫ И РЕЙТИНГ ================================
// ============================================================
function openReviewModal(agentId) {
    document.getElementById('reviewAgentId').value = agentId;
    document.getElementById('reviewRating').value = 5;
    document.getElementById('reviewComment').value = '';
    new bootstrap.Modal(document.getElementById('reviewModal')).show();
}

function submitReview() {
    const agentId = parseInt(document.getElementById('reviewAgentId').value);
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;
    if(rating<1||rating>5){ alert('Оценка от 1 до 5'); return; }
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push({ id: Date.now(), agentId, clientId:1, rating, comment, date: new Date() });
    localStorage.setItem('reviews', JSON.stringify(reviews));
    let agents = JSON.parse(localStorage.getItem('agents'));
    const agentReviews = reviews.filter(r=>r.agentId===agentId);
    const avg = agentReviews.reduce((s,r)=>s+r.rating,0)/agentReviews.length;
    const agent = agents.find(a=>a.id===agentId);
    if(agent) agent.rating = Math.round(avg*10)/10;
    localStorage.setItem('agents', JSON.stringify(agents));
    alert('Спасибо за отзыв!');
    bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
}

// ============================================================
// ========== СДЕЛКИ ==========================================
// ============================================================
function openTransactionModal(propertyId) {
    document.getElementById('transPropertyId').value = propertyId;
    document.getElementById('transAmount').value = '';
    document.getElementById('transClientId').value = '';
    document.getElementById('transAgentId').value = '';
    new bootstrap.Modal(document.getElementById('transactionModal')).show();
}

function makeTransaction() {
    const propId = parseInt(document.getElementById('transPropertyId').value);
    const type = document.getElementById('transType').value;
    const amount = parseFloat(document.getElementById('transAmount').value);
    const clientId = parseInt(document.getElementById('transClientId').value);
    const agentId = parseInt(document.getElementById('transAgentId').value);
    if(!amount||!clientId||!agentId){ alert('Заполните поля'); return; }
    let props = JSON.parse(localStorage.getItem('properties'));
    const property = props.find(p=>p.id===propId);
    if(property.status !== 'свободно'){ alert('Объект недоступен'); return; }
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ id: Date.now(), propertyId:propId, clientId, agentId, type, amount, date: new Date(), status:'завершена' });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    property.status = (type === 'продажа') ? 'продано' : 'сдано';
    localStorage.setItem('properties', JSON.stringify(props));
    alert('Сделка оформлена!');
    bootstrap.Modal.getInstance(document.getElementById('transactionModal')).hide();
    renderProperties();
}

// ============================================================
// ========== ДЕТАЛЬНЫЙ ПРОСМОТР ==============================
// ============================================================
function showDetailsModal(propertyId) {
    const props = JSON.parse(localStorage.getItem('properties'));
    const p = props.find(x=>x.id===propertyId);
    if(!p) return;
    const agents = JSON.parse(localStorage.getItem('agents'));
    let agentsHtml = agents.map(agent => {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const agentReviews = reviews.filter(r=>r.agentId===agent.id);
        const avg = agentReviews.length ? (agentReviews.reduce((s,r)=>s+r.rating,0)/agentReviews.length).toFixed(1) : agent.rating;
        return `<div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <div><strong>${agent.fullName}</strong> (${agent.company})<br>Рейтинг: ${avg} ★</div>
            <button class="btn btn-sm btn-outline-warning" onclick="openReviewModal(${agent.id})">Отзыв</button>
        </div>`;
    }).join('');
    const priceShow = p.priceSale ? `${p.priceSale.toLocaleString()} ₽` : (p.priceRent ? `${p.priceRent.toLocaleString()} ₽/мес` : '—');
    document.getElementById('detailsModalBody').innerHTML = `
        ${p.imageUrl ? `<img src="${p.imageUrl}" class="img-fluid mb-3 rounded" style="max-height:300px; width:100%; object-fit:cover;">` : ''}
        <h4>${p.address}</h4>
        <p><strong>Тип:</strong> ${p.type} | <strong>Площадь:</strong> ${p.totalArea} м²</p>
        <p><strong>Цена:</strong> ${priceShow}</p>
        <p><strong>Статус:</strong> ${p.status}</p>
        <p><strong>Описание:</strong> ${p.description || 'нет'}</p>
        <hr><h5>Агенты</h5>${agentsHtml}
        <div class="mt-2 text-muted small">Отзывы влияют на рейтинг.</div>
    `;
    document.getElementById('detailsModalTitle').innerHTML = `🏠 ${p.address.split(',')[0]}`;
    new bootstrap.Modal(document.getElementById('detailsModal')).show();
}

// ============================================================
// ========== АУТЕНТИФИКАЦИЯ ==================================
// ============================================================
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u=>u.email===email && u.password===password);
    if(user) {
        currentUser = { id: user.id, name: user.fullName, email: user.email, role: user.role };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }
    return false;
}

function register(fullName, email, password, role) {
    const users = JSON.parse(localStorage.getItem('users'));
    if(users.find(u=>u.email===email)) return false;
    users.push({ id: Date.now(), fullName, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUI();
}

function updateUI() {
    const guestBtn = document.getElementById('loginModalBtn');
    const userBlock = document.getElementById('userInfoBlock');
    const addBtn = document.getElementById('addPropertyBtnContainer');
    if(currentUser) {
        guestBtn.classList.add('d-none');
        userBlock.classList.remove('d-none');
        document.getElementById('userNameDisplay').innerText = currentUser.name;
        document.getElementById('userRoleBadge').innerText = currentUser.role === 'admin' ? 'Админ' : (currentUser.role === 'agent' ? 'Агент' : 'Пользователь');
        addBtn.style.display = (currentUser.role === 'admin' || currentUser.role === 'agent') ? 'block' : 'none';
    } else {
        guestBtn.classList.remove('d-none');
        userBlock.classList.add('d-none');
        addBtn.style.display = 'none';
    }
    updateFavCounter();
    renderProperties();
}

// ============================================================
// ========== ЗАПУСК ПРИ ЗАГРУЗКЕ =============================
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initData();
    const saved = localStorage.getItem('currentUser');
    if(saved) currentUser = JSON.parse(saved);
    updateUI();

    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    document.getElementById('loginModalBtn').addEventListener('click', () => authModal.show());
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if(login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value)) {
            authModal.hide();
            updateUI();
        } else alert('Неверные данные');
    });
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pwd = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        if(register(name, email, pwd, role)) {
            alert('Регистрация успешна, войдите');
            document.querySelector('#login-tab').click();
        } else alert('Email уже существует');
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('applyFiltersBtn').addEventListener('click', () => { currentPage = 1; renderProperties(); });
    document.getElementById('scrollBtn').addEventListener('click', () => document.querySelector('.filter-card').scrollIntoView({ behavior: 'smooth' }));

    document.getElementById('favoritesBtn').addEventListener('click', function() {
        if (!currentUser) {
            alert('Войдите в систему, чтобы просмотреть избранное');
            authModal.show();
            return;
        }
        renderFavoritesModal();
        new bootstrap.Modal(document.getElementById('favoritesModal')).show();
    });
});