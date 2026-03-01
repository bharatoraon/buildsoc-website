// MAP INIT
mapboxgl.accessToken = 'pk.eyJ1IjoiYmhhcmF0b3Jhb24iLCJhIjoiY21oY29lZnh1MXc0YTJ2cGN5ZHluZWowMyJ9.qvW4djVZVpIj1YJd3OQW2w';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [78.35, 17.45],
  zoom: 12
});
map.on('style.load', () => {
  const layers = map.getStyle().layers;
  for (const layer of layers) {
    if (layer.type === 'symbol' || layer.type === 'text' || layer.id.includes('label')) {
      map.removeLayer(layer.id);
    }
  }
});

// THEME TOGGLE
const toggleMain = document.getElementById('toggleModemain');
const toggleMobile = document.getElementById('toggleMode');
let darkMode = false;

function updateTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark');
  const icon = darkMode ? '🌙' : '☀';
  if (toggleMain) toggleMain.textContent = icon;
  if (toggleMobile) toggleMobile.textContent = icon;
  map.setStyle(darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11');

  const logo = document.querySelector('.logo-main');
  if (logo) logo.src = darkMode ? 'assets/buildsoc_logo_light.svg' : 'assets/buildsoc_logo.svg';

  map.once('style.load', () => {
    const layers = map.getStyle().layers;
    for (const layer of layers) {
      if (layer.type === 'symbol' || layer.type === 'text' || layer.id.includes('label')) {
        map.removeLayer(layer.id);
      }
    }
  });
}

toggleMain?.addEventListener('click', updateTheme);
toggleMobile?.addEventListener('click', updateTheme);

// NAVIGATION
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const links = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('.overlay, .home-viewport');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('show');
      menuToggle.textContent = navMenu.classList.contains('show') ? '✖' : '☰';
    });

    document.addEventListener('click', (ev) => {
      if (!navMenu.contains(ev.target) && !menuToggle.contains(ev.target)) {
        navMenu.classList.remove('show');
        menuToggle.textContent = '☰';
      }
    });
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').substring(1);
      sections.forEach(sec => sec.classList.add('hidden'));
      const target = document.getElementById(id);
      if (target) target.classList.remove('hidden');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        menuToggle.textContent = '☰';
      }
    });
  });
});

// CONTACT FORM - BACKGROUND SUBMISSION
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);

      try {
        // NOTE: Replace the fetch URL with your actual Formspree endpoint ID
        const response = await fetch("https://formspree.io/f/mojnzwjl", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          btn.textContent = 'Message Sent Successfully ✓';
          btn.style.background = '#4CAF50';
          btn.style.color = 'white';
          form.reset();
        } else {
          throw new Error('Formspree return non-200');
        }
      } catch (err) {
        console.error('Email sending failed:', err);
        btn.textContent = 'Error. Please try again.';
        btn.style.background = '#e74c3c';
        btn.style.color = 'white';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 4000);
    });
  }
});
