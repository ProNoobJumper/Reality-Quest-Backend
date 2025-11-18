const API_BASE_URL = '';

let authToken = localStorage.getItem('rq_token') || null;
let currentUser = localStorage.getItem('rq_user')
  ? JSON.parse(localStorage.getItem('rq_user'))
  : null;

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const authUserInfo = document.getElementById('auth-user-info');

const challengeForm = document.getElementById('challenge-form');
const filterCategorySelect = document.getElementById('filter-category');
const challengesList = document.getElementById('challenges-list');

const leaderboardBySelect = document.getElementById('leaderboard-by');
const leaderboardBody = document.getElementById('leaderboard-body');

// Layout sections
const appSection = document.getElementById('app-section');
const authChoiceSection = document.getElementById('auth-choice');
const authSection = document.getElementById('auth-section');
const challengesSection = document.getElementById('challenges-section');
const leaderboardSection = document.getElementById('leaderboard-section');

// Dashboard logout button (on challenges/leaderboard pages)
const dashboardLogoutBtn = document.getElementById('dashboard-logout-btn');

const toastEl = document.getElementById('toast');
const welcomeDog = document.getElementById('welcome-dog');
const introOverlay = document.getElementById('intro-overlay');
const heroClockWrapper = document.querySelector('.hero-clock-wrapper');

// --- Helpers ---

function showToast(message, isError = false) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.toggle('error', isError);
  toastEl.classList.remove('hidden');
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 3000);
}

async function apiRequest(path, options = {}) {
  const url = API_BASE_URL + path;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = (data && data.message) || 'Request failed';
    throw new Error(message);
  }

  return data;
}

function updateLayoutForAuth() {
  const isAuthed = !!authToken;

  if (isAuthed) {
    // After login: hide all auth UI, show main app
    if (authChoiceSection) authChoiceSection.style.display = 'none';
    if (authSection) authSection.style.display = 'none';
    if (challengesSection) challengesSection.style.display = '';
    if (leaderboardSection) leaderboardSection.style.display = '';
  } else {
    // Before login: only show the "Get started" choice card
    if (authChoiceSection) authChoiceSection.style.display = '';
    if (authSection) authSection.style.display = 'none';
    if (challengesSection) challengesSection.style.display = 'none';
    if (leaderboardSection) leaderboardSection.style.display = 'none';
  }
}

function updateAuthUI() {
  if (authUserInfo && logoutBtn) {
    if (currentUser && authToken) {
      authUserInfo.textContent = `Logged in as ${currentUser.name} (XP: ${currentUser.xp})`;
      logoutBtn.classList.remove('hidden');
    } else {
      authUserInfo.textContent = 'Not logged in';
      logoutBtn.classList.add('hidden');
    }
  }
  updateLayoutForAuth();
}

function setAuth(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem('rq_token', token);
  localStorage.setItem('rq_user', JSON.stringify(user));
  updateAuthUI();
}

function clearAuth() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('rq_token');
  localStorage.removeItem('rq_user');
  updateAuthUI();
}

// --- Auth handlers ---

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  try {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAuth(res.token, res.user);
    showToast('Registered and logged in');
    registerForm.reset();
    if (challengesList) await loadChallenges();
    if (leaderboardBody) await loadLeaderboard();
  } catch (err) {
    showToast(err.message, true);
  }
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuth(res.token, res.user);
    showToast('Logged in');
    loginForm.reset();
    if (challengesList) await loadChallenges();
    if (leaderboardBody) await loadLeaderboard();
  } catch (err) {
    showToast(err.message, true);
  }
});

async function handleLogout() {
  try {
    await apiRequest('/api/auth/logout');
  } catch {
    // ignore errors
  }
  clearAuth();
  showToast('Logged out');
  if (challengesList) challengesList.innerHTML = '';
  if (leaderboardBody) leaderboardBody.innerHTML = '';
}

logoutBtn?.addEventListener('click', handleLogout);

dashboardLogoutBtn?.addEventListener('click', handleLogout);

// --- Challenge handlers ---

challengeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!authToken) {
    showToast('You must be logged in to create challenges', true);
    return;
  }

  const title = document.getElementById('challenge-title').value.trim();
  const description = document.getElementById('challenge-description').value.trim();
  const category = document.getElementById('challenge-category').value;
  const difficulty = document.getElementById('challenge-difficulty').value;
  const xpReward = parseInt(document.getElementById('challenge-xp').value, 10) || 10;

  try {
    await apiRequest('/api/challenges', {
      method: 'POST',
      body: JSON.stringify({ title, description, category, difficulty, xpReward }),
    });
    showToast('Challenge created');
    challengeForm.reset();
    document.getElementById('challenge-xp').value = 10;
    await loadChallenges();
  } catch (err) {
    showToast(err.message, true);
  }
});

filterCategorySelect?.addEventListener('change', () => {
  loadChallenges().catch((err) => showToast(err.message, true));
});

async function loadChallenges() {
  if (!authToken) {
    challengesList.innerHTML = '<p class="error">Login to view challenges.</p>';
    return;
  }

  const category = filterCategorySelect.value;
  let path = '/api/challenges';
  if (category) {
    path = `/api/challenges/category/${encodeURIComponent(category)}`;
  }

  try {
    const res = await apiRequest(path);
    const challenges = res.data || [];
    renderChallenges(challenges);
  } catch (err) {
    challengesList.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function renderChallenges(challenges) {
  if (!challenges || challenges.length === 0) {
    challengesList.innerHTML = '<p>No challenges yet.</p>';
    return;
  }

  challengesList.innerHTML = '';
  challenges.forEach((ch) => {
    const item = document.createElement('div');
    item.className = 'challenge-item';

    const categoryClass = (ch.category || 'Other').toLowerCase();
    const difficultyClass = (ch.difficulty || 'Easy').toLowerCase();

    item.innerHTML = `
      <div class="challenge-header">
        <div>
          <strong>${ch.title || ''}</strong>
          <div class="challenge-meta">
            <span class="badge ${'badge ' + categoryClass}">${ch.category}</span>
            <span class="badge ${'badge ' + difficultyClass}">${ch.difficulty}</span>
            <span class="badge">XP: ${ch.xpReward || 10}</span>
          </div>
        </div>
        <button data-id="${ch._id}" class="complete-btn">Complete</button>
      </div>
      <p>${ch.description || ''}</p>
    `;

    challengesList.appendChild(item);
  });

  // Attach complete handlers
  challengesList.querySelectorAll('.complete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const card = btn.closest('.challenge-item');
      try {
        const res = await apiRequest(`/api/challenges/${id}/complete`, {
          method: 'POST',
        });

        if (currentUser) {
          currentUser.xp = res.data.xp;
          localStorage.setItem('rq_user', JSON.stringify(currentUser));
          updateAuthUI();
        }

        // Trigger XP pulse animation on the card, then remove it from the list
        if (card) {
          card.classList.remove('challenge-complete-anim');
          // force reflow to restart animation if clicked multiple times
          void card.offsetWidth;
          card.classList.add('challenge-complete-anim');
          setTimeout(() => {
            card.classList.remove('challenge-complete-anim');
            card.remove();
            // If no challenges remain, show an empty state message
            if (!challengesList.querySelector('.challenge-item')) {
              challengesList.innerHTML = '<p>No challenges yet.</p>';
            }
          }, 900);
        }

        showToast('Challenge completed!');
        if (leaderboardBody) await loadLeaderboard();
      } catch (err) {
        showToast(err.message, true);
      }
    });
  });
}

// --- Leaderboard handlers ---

leaderboardBySelect?.addEventListener('change', () => {
  loadLeaderboard().catch((err) => showToast(err.message, true));
});

async function loadLeaderboard() {
  if (!authToken) {
    leaderboardBody.innerHTML = '';
    return;
  }

  const by = leaderboardBySelect.value || 'xp';

  try {
    const res = await apiRequest(`/api/leaderboard?by=${encodeURIComponent(by)}`);
    const users = res.data || [];
    renderLeaderboard(users);
  } catch (err) {
    leaderboardBody.innerHTML = `<tr><td colspan="6" class="error">${err.message}</td></tr>`;
  }
}

function renderLeaderboard(users) {
  if (!users || users.length === 0) {
    leaderboardBody.innerHTML = '<tr><td colspan="6">No data yet.</td></tr>';
    return;
  }

  leaderboardBody.innerHTML = '';
  users.forEach((user, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.xp}</td>
      <td>${user.currentStreak}</td>
      <td>${user.longestStreak}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

// --- Initial load ---

updateAuthUI();

// Intro overlay: smoke + typing, then reveal landing
if (introOverlay) {
  setTimeout(() => {
    introOverlay.classList.add('hidden');
    document.body.classList.remove('intro-lock');
    if (heroClockWrapper) {
      heroClockWrapper.classList.add('clock-animate');
    }
  }, 3200); // roughly typing time + pause
} else if (heroClockWrapper) {
  // No intro overlay (direct load) - animate immediately
  heroClockWrapper.classList.add('clock-animate');
}

// Show husky dog helper for unauthenticated users on landing
if (welcomeDog && !authToken) {
  setTimeout(() => {
    welcomeDog.classList.add('visible');
  }, 3800); // after intro finishes
}

// Smooth scroll from hero to app section
const heroGetStartedBtn = document.getElementById('hero-get-started');
if (heroGetStartedBtn) {
  heroGetStartedBtn.addEventListener('click', () => {
    const appSection = document.getElementById('app-section');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Auth choice buttons
const authSigninBtn = document.getElementById('auth-signin-btn');
const authSignupBtn = document.getElementById('auth-signup-btn');

if (authSigninBtn) {
  authSigninBtn.addEventListener('click', () => {
    window.location.href = '/signin.html';
  });
}

if (authSignupBtn) {
  authSignupBtn.addEventListener('click', () => {
    window.location.href = '/signup.html';
  });
}

if (authToken) {
  if (challengesList) {
    loadChallenges().catch((err) => console.error(err));
  }
  if (leaderboardBody) {
    loadLeaderboard().catch((err) => console.error(err));
  }
}
