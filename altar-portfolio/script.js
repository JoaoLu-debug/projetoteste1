document.addEventListener('DOMContentLoaded', () => {
  // --- NAVIGATION Hamburger Menu reveal ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- HEADER RESIZE ON SCROLL ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- SCROLL-REVEAL OBSERVER ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- ACTIVE NAV LINK OBSERVER ---
  const sections = document.querySelectorAll('section');
  const navLinksList = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --- DYNAMIC ALTITUDE TRACKER ---
  const altitudeVal = document.getElementById('altitude-val');
  const minAltitude = 2100; // Starting altitude (m)
  const maxAltitude = 3200; // Target summit elevation (m)

  function updateAltitude() {
    if (!altitudeVal) return;
    
    // Calculate scroll percentage
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    
    // Interpolate altitude
    const currentAltitude = Math.round(minAltitude + (scrollPercent * (maxAltitude - minAltitude)));
    
    // Animate counter slightly with random technical jitter
    const jitter = Math.random() > 0.85 ? Math.floor(Math.random() * 3) - 1 : 0;
    const displayAltitude = currentAltitude + jitter;
    
    altitudeVal.textContent = `${displayAltitude}M`;
  }

  window.addEventListener('scroll', updateAltitude, { passive: true });
  // Initial run to set starting altitude
  updateAltitude();

  // --- MOUSE LATENCY COORDINATE TRACKER (HERO SECTION) ---
  const geoVal = document.getElementById('geo-val');
  const initialLat = 45.8918;
  const initialLng = -120.3019;

  window.addEventListener('mousemove', (e) => {
    if (!geoVal) return;
    
    // Calculate percentage offset based on viewport
    const xPct = e.clientX / window.innerWidth;
    const yPct = e.clientY / window.innerHeight;
    
    // Map offset to fine geographic coordinate variation
    const currentLat = (initialLat + (yPct * 0.005) - 0.0025).toFixed(4);
    const currentLng = (initialLng + (xPct * 0.005) - 0.0025).toFixed(4);
    
    geoVal.textContent = `${currentLat}° N, ${Math.abs(currentLng).toFixed(4)}° W`;
  });

  // --- FORM INPUT FLOATING LABELS & VALIDATION ---
  const formInputs = document.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    // Basic placeholder check/styling on interact
    input.addEventListener('focus', () => {
      input.style.borderBottomColor = 'var(--color-accent)';
    });
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.style.borderBottomColor = 'var(--color-border)';
      } else {
        input.style.borderBottomColor = 'var(--color-border-active)';
      }
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-primary');
      const submitText = submitBtn.querySelector('span');
      
      // Tactile Loading State
      submitText.textContent = 'TRANSMITTING...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitText.textContent = 'TRANSMITTED';
        submitBtn.style.backgroundColor = 'var(--color-accent)';
        submitBtn.style.color = '#fff';
        submitBtn.style.opacity = '1';
        
        // Reset after duration
        setTimeout(() => {
          contactForm.reset();
          submitText.textContent = 'TRANSMIT SIGNAL';
          submitBtn.style.backgroundColor = 'var(--color-text-primary)';
          submitBtn.style.color = 'var(--color-bg-dark)';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
