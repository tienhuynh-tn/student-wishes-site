
const grid = document.getElementById('wishGrid');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const resetBtn = document.getElementById('resetBtn');
const modal = document.getElementById('wishModal');
const modalNumber = document.getElementById('modalNumber');
const modalWish = document.getElementById('modalWish');
const modalTitle = document.getElementById('modalTitle');
const nextBtn = document.getElementById('nextBtn');
const finale = document.getElementById('finale');
const surpriseVideo = document.getElementById('surpriseVideo');
const wishSound = document.getElementById('wishSound');
const STORAGE_KEY = 'student-wishes-opened-v1';

let wishes = [];
let opened = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
let currentIndex = 0;

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...opened].sort((a, b) => a - b)));
}

function playWishSound() {
  if (!wishSound) return;
  wishSound.currentTime = 0;
  wishSound.play().catch(() => {});
}

function updateProgress() {
  const count = opened.size;
  progressText.textContent = `Đã mở ${count}/${wishes.length} lời chúc`;
  progressBar.style.width = `${(count / wishes.length) * 100}%`;
  if (count === wishes.length) {
    finale.classList.add('is-visible');
    finale.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    finale.classList.remove('is-visible');
    surpriseVideo.pause();
  }
}

function renderTiles() {
  grid.innerHTML = '';
  wishes.forEach((wish, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'wish-tile';
    tile.setAttribute('aria-label', `Mở lời chúc số ${index + 1}`);
    if (opened.has(index)) tile.classList.add('is-opened');
    tile.innerHTML = `
      <span class="wish-tile__lock">${opened.has(index) ? '✓' : ''}</span>
      <span class="wish-tile__icon">${window.WISH_ICONS[index] || '💌'}</span>
      <span class="wish-tile__number">Lời chúc ${String(index + 1).padStart(2, '0')}</span>
      <span class="wish-tile__label">${opened.has(index) ? 'Xem lại' : 'Mở ngay'}</span>
    `;
    tile.addEventListener('click', () => openWish(index));
    grid.appendChild(tile);
  });
  updateProgress();
}

function loadWishes(data) {
  wishes = data;
  opened = new Set([...opened].filter((index) => index >= 0 && index < wishes.length));
  renderTiles();
}

function openWish(index) {
  playWishSound();
  currentIndex = index;
  opened.add(index);
  saveProgress();
  renderTiles();
  modalNumber.textContent = String(index + 1).padStart(2, '0');
  modalTitle.textContent = `Lời chúc số ${index + 1}`;
  modalWish.textContent = wishes[index];
  const nextUnopenedIndex = wishes.findIndex((_, wishIndex) => !opened.has(wishIndex));
  nextBtn.textContent = nextUnopenedIndex === -1 ? 'Xem video bất ngờ' : `Mở lời chúc số ${nextUnopenedIndex + 1}`;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  nextBtn.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

nextBtn.addEventListener('click', () => {
  closeModal();
  const nextUnopenedIndex = wishes.findIndex((_, wishIndex) => !opened.has(wishIndex));
  if (nextUnopenedIndex !== -1) {
    setTimeout(() => openWish(nextUnopenedIndex), 160);
  } else {
    finale.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

document.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
resetBtn.addEventListener('click', () => {
  opened = new Set();
  saveProgress();
  renderTiles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

fetch('wishes.json')
  .then((response) => response.json())
  .then(loadWishes)
  .catch(() => {
    if (Array.isArray(window.WISHES)) {
      loadWishes(window.WISHES);
      return;
    }
    grid.innerHTML = '<p>Không thể tải lời chúc. Vui lòng kiểm tra file wishes.json.</p>';
  });
