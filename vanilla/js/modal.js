// ── Modal / Dialog System ─────────────────────────────────
// Creates accessible modal dialogs on-demand

let openBackdrop = null;

/** 
 * Opens a modal dialog.
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {string} opts.body  - HTML string for the dialog body
 * @param {string} [opts.footer] - HTML string for the footer
 * @param {function} [opts.onOpen] - called with (backdropEl) after mount
 * @param {function} [opts.onClose]
 * @returns {{ close: function }}
 */
export function openModal({ title, description, body, footer, onOpen, onClose } = {}) {
  // Close existing modal
  if (openBackdrop) openBackdrop.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'dialog-backdrop';
  backdrop.innerHTML = `
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="dialog-header">
        <h2 class="dialog-title" id="modal-title">${title ?? ''}</h2>
        ${description ? `<p class="dialog-desc">${description}</p>` : ''}
      </div>
      <div class="dialog-body">${body ?? ''}</div>
      ${footer ? `<div class="dialog-footer">${footer}</div>` : ''}
    </div>
  `;

  // Close on backdrop click (outside dialog)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  // Close on Escape
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);

  document.body.appendChild(backdrop);
  openBackdrop = backdrop;

  function close() {
    backdrop.remove();
    document.removeEventListener('keydown', onKey);
    if (openBackdrop === backdrop) openBackdrop = null;
    onClose?.();
  }

  if (onOpen) onOpen(backdrop);

  return { close };
}

/** Closes the currently open modal, if any */
export function closeModal() {
  if (openBackdrop) {
    openBackdrop.remove();
    openBackdrop = null;
  }
}
