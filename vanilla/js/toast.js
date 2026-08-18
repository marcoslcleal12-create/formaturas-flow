// ── Toast Notification System ─────────────────────────────
// Mimics Sonner behavior: auto-dismiss, success/error styles

let container = null;

function ensureContainer() {
  if (!container) {
    container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }
  return container;
}

function show(message, type = 'info', duration = 3500) {
  const c = ensureContainer();
  const el = document.createElement('div');
  el.className = `toast ${type}`;

  const icon = type === 'success'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'error'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  el.innerHTML = icon + `<span>${message}</span>`;
  c.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

export const toast = {
  success: (msg, opts = {}) => show(msg, 'success', opts.duration ?? 3500),
  error:   (msg, opts = {}) => show(msg, 'error',   opts.duration ?? 4500),
  info:    (msg, opts = {}) => show(msg, 'info',    opts.duration ?? 3500),
};
