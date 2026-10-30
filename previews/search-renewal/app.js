const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '메뉴 열기');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
  const input = [...document.querySelectorAll('input[name="interest"]')].find(item => item.value === link.dataset.interest);
  if (input) input.checked = true;
}));

const form = document.querySelector('#contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const company = data.get('company').trim();
  const message = data.get('message').trim();
  if (!company || !message) {
    const status = document.querySelector('#form-status');
    status.textContent = '회사·브랜드명과 문의 내용을 입력해 주세요.';
    status.hidden = false;
    (!company ? document.querySelector('#company') : document.querySelector('#message')).focus();
    return;
  }
  const subject = `[에이정 프로젝트 문의] ${company} · ${data.get('interest')}`;
  const body = `관심 서비스: ${data.get('interest')}\n회사·브랜드: ${company}\n회신 이메일: ${data.get('reply')}\n홈페이지: ${data.get('website') || '미입력'}\n\n문의 내용\n${message}`;
  const mailto = `mailto:aijeong.insight@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const fallback = document.querySelector('#email-fallback');
  fallback.href = mailto;
  fallback.hidden = false;
  const status = document.querySelector('#form-status');
  status.textContent = '이메일 초안을 준비했습니다. 이메일 앱에서 내용을 확인하고 보내주세요. 앱이 열리지 않으면 아래 링크를 이용해 주세요.';
  status.hidden = false;
  window.location.href = mailto;
});
