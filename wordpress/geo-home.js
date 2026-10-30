/* The existing theme owns the navigation, dark mode and scroll behavior. */
(function () {
  document.querySelectorAll('[data-interest]').forEach(function (link) {
    link.addEventListener('click', function () {
      var input = Array.from(document.querySelectorAll('input[name="interest"]')).find(function (item) {
        return item.value === link.dataset.interest;
      });
      if (input) input.checked = true;
    });
  });

  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var company = data.get('company').trim();
    var message = data.get('message').trim();
    var status = document.getElementById('form-status');
    if (!company || !message) {
      status.textContent = '회사·브랜드명과 문의 내용을 입력해 주세요';
      status.hidden = false;
      document.getElementById(!company ? 'company' : 'message').focus();
      return;
    }
    var subject = '[에이정 프로젝트 문의] ' + company + ' · ' + data.get('interest');
    var body = '관심 서비스: ' + data.get('interest') + '\n회사·브랜드: ' + company + '\n회신 이메일: ' + data.get('reply') + '\n홈페이지: ' + (data.get('website') || '미입력') + '\n\n문의 내용\n' + message;
    var recipient = document.getElementById('email-fallback').getAttribute('href').split('?')[0];
    var mailto = recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    var fallback = document.getElementById('email-fallback');
    fallback.href = mailto;
    fallback.hidden = false;
    status.textContent = '이메일 앱에서 내용을 확인한 뒤 보내주세요';
    status.hidden = false;
    window.location.href = mailto;
  });
})();
