// MAP INIT
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
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

// CONTACT FORM - EMAILJS INTEGRATION
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS (Note: User needs to insert their public key here)
  if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY");
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Ensure form IDs match EmailJS template variables
      emailjs.sendForm('default_service', 'template_buildsoc', this)
        .then(() => {
          btn.textContent = 'Message Sent Successfully ✓';
          btn.style.background = '#4CAF50';
          btn.style.color = 'white';
          form.reset();

          // Reset button after 4 seconds
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 4000);
        })
        .catch((err) => {
          console.error('Email sending failed:', err);
          btn.textContent = 'Error. Please try again.';
          btn.style.background = '#e74c3c';
          btn.style.color = 'white';
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }
});
