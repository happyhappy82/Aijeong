/* Original theme drawer, with scrolling, keyboard access and tablet resizing. */
(function () {
  var button = document.getElementById('mobile-menu-button');
  var menu = document.getElementById('mobile-menu');
  var backdrop = document.getElementById('mobile-menu-backdrop');
  var closeButton = document.getElementById('mobile-menu-close');
  if (!button || !menu || !backdrop || !closeButton) return;

  var opened = false;
  var previousOverflow = '';
  var desktop = window.matchMedia('(min-width: 1024px)');
  button.setAttribute('aria-controls', 'mobile-menu');
  button.setAttribute('aria-expanded', 'false');
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', '메뉴');
  menu.setAttribute('aria-hidden', 'true');

  function openMenu() {
    if (opened || desktop.matches) return;
    opened = true;
    previousOverflow = document.body.style.overflow;
    menu.classList.remove('translate-x-full');
    menu.classList.add('translate-x-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
    button.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeMenu(restoreFocus) {
    if (!opened) return;
    opened = false;
    menu.classList.remove('translate-x-0');
    menu.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    button.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    if (restoreFocus && !desktop.matches) button.focus();
  }

  button.addEventListener('click', openMenu);
  closeButton.addEventListener('click', function () { closeMenu(true); });
  backdrop.addEventListener('click', function () { closeMenu(true); });
  menu.querySelectorAll('.mobile-menu-link').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(true); });
  });
  menu.addEventListener('keydown', function (event) {
    if (!opened) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    }
    if (event.key === 'Tab') {
      var targets = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
      var first = targets[0];
      var last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  function resized(event) { if (event.matches) closeMenu(false); }
  if (desktop.addEventListener) desktop.addEventListener('change', resized);
  else desktop.addListener(resized);
})();
