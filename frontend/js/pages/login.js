document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = { login: document.getElementById('loginForm'), register: document.getElementById('registerForm') };
  const next = new URLSearchParams(location.search).get('next') || 'index.html';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      Object.entries(forms).forEach(([key, form]) => form.classList.toggle('active', key === tab.dataset.tab));
    });
  });

  forms.login.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await Api.post('/auth/login', {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value,
      });
      window.location.href = next;
    } catch (err) {
      showToast(err.message || 'تعذّر تسجيل الدخول');
      btn.disabled = false;
    }
  });

  forms.register.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await Api.post('/auth/register', {
        fullName: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        password: document.getElementById('regPassword').value,
      });
      window.location.href = next;
    } catch (err) {
      showToast(err.message || 'تعذّر إنشاء الحساب');
      btn.disabled = false;
    }
  });
});
