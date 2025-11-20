// State
const state = {
    currentUser: null,
    currentDate: new Date().toISOString().split('T')[0],
    selectedTime: 'Morning',
    selectedCategory: 'Eating',
    selectedEmoji: '',
    editingId: null
};

// Constants
const CATEGORIES = {
    'Eating': ['🥗', '🍔', '🍎', '☕', '🥤', '🍫'],
    'Toilette': ['💧', '💩', '🚽'],
    'Sports': ['🏃', '🏋️', '🧘', '🚴', '🏊'],
    'Mood': ['😊', '😐', '😢', '😡', '😴', '🤩'],
    'Sleeping': ['😴', '🛌', '🌙']
};

// DOM Elements
const els = {
    modal: document.getElementById('consent-modal'),
    btnAcceptStorage: document.getElementById('btn-accept-storage'),
    loginScreen: document.getElementById('login-screen'),
    appDashboard: document.getElementById('app-dashboard'),
    userList: document.getElementById('user-list'),
    newUserInput: document.getElementById('new-username'),
    btnCreateUser: document.getElementById('btn-create-user'),
    currentUserDisplay: document.getElementById('current-user-display'),
    btnLogout: document.getElementById('btn-logout'),
    datePicker: document.getElementById('date-picker'),
    btnPrevDate: document.getElementById('btn-prev-date'),
    btnNextDate: document.getElementById('btn-next-date'),
    timeBtns: document.querySelectorAll('.time-btn'),
    catBtns: document.querySelectorAll('.cat-btn'),
    emojiOptions: document.getElementById('emoji-options'),
    entryText: document.getElementById('entry-text'),
    btnSave: document.getElementById('btn-save-entry'),
    btnCancelEdit: document.getElementById('btn-cancel-edit'),
    activityFeed: document.getElementById('activity-feed')
};

// Initialization
function init() {
    checkStorageConsent();
    setupEventListeners();
    renderEmojiOptions();

    // Set initial date
    els.datePicker.value = state.currentDate;
}

function checkStorageConsent() {
    if (localStorage.getItem('storage_consent') === 'true') {
        els.modal.classList.add('hidden');
        showLoginScreen();
    } else {
        els.modal.classList.remove('hidden');
    }
}

function setupEventListeners() {
    // Consent
    els.btnAcceptStorage.addEventListener('click', () => {
        localStorage.setItem('storage_consent', 'true');
        els.modal.classList.add('hidden');
        showLoginScreen();
    });

    // Login / User
    els.btnCreateUser.addEventListener('click', createUser);
    els.btnLogout.addEventListener('click', logout);

    // Date Controls
    els.datePicker.addEventListener('change', (e) => {
        state.currentDate = e.target.value;
        // No need to reload entries as feed is global, but maybe we want to highlight?
        // For now, just updating state for new entries is enough.
    });

    // Removed prev/next date listeners

    // Input Selection
    els.timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            els.timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedTime = btn.dataset.time;
        });
    });

    els.catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            els.catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedCategory = btn.dataset.cat;
            renderEmojiOptions();
        });
    });

    // Save
    els.btnSave.addEventListener('click', saveEntry);
    els.btnCancelEdit.addEventListener('click', cancelEdit);
}

// Storage Helpers
function getStorageKey() {
    return `tracker_data_${state.currentUser}`;
}

function getData() {
    const key = getStorageKey();
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveData(data) {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(data));
}

// Logic
function showLoginScreen() {
    els.loginScreen.classList.remove('hidden');
    renderUserList();
}

function renderUserList() {
    const users = JSON.parse(localStorage.getItem('tracker_users') || '[]');
    els.userList.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-btn';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = user;
        div.appendChild(nameSpan);

        // Delete user button
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.style.background = 'transparent';
        delBtn.style.color = '#ef4444';
        delBtn.style.fontSize = '1.2rem';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteUser(user);
        };
        div.appendChild(delBtn);

        div.onclick = () => login(user);
        els.userList.appendChild(div);
    });
}

function createUser() {
    const name = els.newUserInput.value.trim();
    if (!name) return;

    const users = JSON.parse(localStorage.getItem('tracker_users') || '[]');
    if (!users.includes(name)) {
        users.push(name);
        localStorage.setItem('tracker_users', JSON.stringify(users));
        els.newUserInput.value = '';
        renderUserList();
    }
}

function deleteUser(user) {
    if (!confirm(`Delete user "${user}" and all data?`)) return;

    let users = JSON.parse(localStorage.getItem('tracker_users') || '[]');
    users = users.filter(u => u !== user);
    localStorage.setItem('tracker_users', JSON.stringify(users));

    // Cleanup data
    localStorage.removeItem(`tracker_data_${user}`);
    renderUserList();
}

function login(user) {
    state.currentUser = user;
    els.currentUserDisplay.textContent = user;
    els.loginScreen.classList.add('hidden');
    els.appDashboard.classList.remove('hidden');
    loadEntries();
}

function logout() {
    state.currentUser = null;
    els.appDashboard.classList.add('hidden');
    els.loginScreen.classList.remove('hidden');
}

function renderEmojiOptions() {
    const emojis = CATEGORIES[state.selectedCategory];
    els.emojiOptions.innerHTML = '';

    // If switching categories, reset selected emoji unless we are editing and it matches
    if (!state.editingId && !emojis.includes(state.selectedEmoji)) {
        state.selectedEmoji = emojis[0];
    }

    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.className = 'emoji-option';
        if (emoji === state.selectedEmoji) span.classList.add('selected');
        span.textContent = emoji;
        span.onclick = () => {
            document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
            span.classList.add('selected');
            state.selectedEmoji = emoji;
        };
        els.emojiOptions.appendChild(span);
    });
}

function saveEntry() {
    const text = els.entryText.value.trim();
    if (!text && !state.selectedEmoji) return;

    const data = getData();

    if (state.editingId) {
        // Update existing
        const index = data.findIndex(e => e.id === state.editingId);
        if (index !== -1) {
            data[index] = {
                ...data[index],
                dateStr: state.currentDate, // Allow updating date if picker changed
                timeOfDay: state.selectedTime,
                category: state.selectedCategory,
                emoji: state.selectedEmoji,
                content: text,
                updatedAt: new Date().toISOString()
            };
        }
        state.editingId = null;
        els.btnSave.textContent = 'Save Entry';
        els.btnCancelEdit.classList.add('hidden');
    } else {
        // Create new
        const newEntry = {
            id: Date.now().toString(),
            dateStr: state.currentDate,
            timeOfDay: state.selectedTime,
            category: state.selectedCategory,
            emoji: state.selectedEmoji,
            content: text,
            createdAt: new Date().toISOString()
        };
        data.push(newEntry);
    }

    saveData(data);
    els.entryText.value = '';
    loadEntries();
}

function editEntry(id) {
    const data = getData();
    const entry = data.find(e => e.id === id);
    if (!entry) return;

    state.editingId = id;
    state.currentDate = entry.dateStr; // Set picker to entry date
    els.datePicker.value = state.currentDate;

    state.selectedTime = entry.timeOfDay;
    state.selectedCategory = entry.category;
    state.selectedEmoji = entry.emoji;

    // Update UI
    els.entryText.value = entry.content;
    els.btnSave.textContent = 'Update Entry';
    els.btnCancelEdit.classList.remove('hidden');

    // Update buttons state
    els.timeBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.time === state.selectedTime);
    });
    els.catBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.cat === state.selectedCategory);
    });

    renderEmojiOptions();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    state.editingId = null;
    els.entryText.value = '';
    els.btnSave.textContent = 'Save Entry';
    els.btnCancelEdit.classList.add('hidden');

    // Reset to today
    state.currentDate = new Date().toISOString().split('T')[0];
    els.datePicker.value = state.currentDate;

    // Reset to defaults
    state.selectedTime = 'Morning';
    state.selectedCategory = 'Eating';

    els.timeBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.time === state.selectedTime);
    });
    els.catBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.cat === state.selectedCategory);
    });
    renderEmojiOptions();
}

function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    let data = getData();
    data = data.filter(e => e.id !== id);
    saveData(data);
    loadEntries();
}

function loadEntries() {
    const data = getData();

    // Sort by date desc, then time (Morning->Night), then created desc
    // To sort time correctly, we need a map
    const timeOrder = { 'Morning': 0, 'Noon': 1, 'Evening': 2, 'Night': 3 };

    data.sort((a, b) => {
        if (a.dateStr !== b.dateStr) return b.dateStr.localeCompare(a.dateStr);
        if (a.timeOfDay !== b.timeOfDay) return timeOrder[a.timeOfDay] - timeOrder[b.timeOfDay];
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    els.activityFeed.innerHTML = '';

    if (data.length === 0) {
        els.activityFeed.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">No entries yet.</p>';
        return;
    }

    let currentDate = null;

    data.forEach(entry => {
        // Date Header
        if (entry.dateStr !== currentDate) {
            currentDate = entry.dateStr;
            const dateHeader = document.createElement('h4');
            dateHeader.style.cssText = 'color: var(--text-muted); margin: 20px 0 10px 0; font-weight: 500;';

            // Format date nicely (e.g., "Today", "Yesterday", or "Nov 20, 2025")
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            if (currentDate === today) dateHeader.textContent = 'Today';
            else if (currentDate === yesterday) dateHeader.textContent = 'Yesterday';
            else dateHeader.textContent = new Date(currentDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            els.activityFeed.appendChild(dateHeader);
        }

        const el = document.createElement('div');
        el.className = 'feed-item';
        el.innerHTML = `
            <div class="feed-emoji">${entry.emoji}</div>
            <div class="feed-content">
                <div class="feed-header">
                    <span class="feed-time">${entry.timeOfDay}</span>
                    <span class="feed-cat">${entry.category}</span>
                </div>
                <div class="feed-text">${entry.content}</div>
                <div class="feed-actions">
                    <button class="action-btn" onclick="editEntry('${entry.id}')">Edit</button>
                    <button class="action-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
                </div>
            </div>
        `;
        els.activityFeed.appendChild(el);
    });
}

// Start
init();
