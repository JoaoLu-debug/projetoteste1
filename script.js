document.addEventListener('DOMContentLoaded', () => {
  
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
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- ACTIVE NAV LINK OBSERVER ---
  const sections = document.querySelectorAll('section');
  const navLinksList = document.querySelectorAll('.nav-col-links a');
  const navRowLinks = document.querySelectorAll('.nav-row-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update main nav header links
    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Update bottom navigation rows
    navRowLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --- INTERACTIVE INDEX LIST (Selected commissions) ---
  const indexItems = document.querySelectorAll('.index-item');
  const heroImage = document.querySelector('.hero-image');
  const geoVal = document.getElementById('geo-val');

  indexItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all other items
      indexItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      // Add active to current
      item.classList.add('active');

      // Update hero image preview when active item changes
      const imgPath = item.getAttribute('data-img');
      if (heroImage && imgPath) {
        heroImage.style.opacity = '0.3';
        setTimeout(() => {
          heroImage.src = imgPath;
          heroImage.style.opacity = '1';
        }, 300);
      }

      // Update coordinates text dynamically to match project
      const coords = item.getAttribute('data-coords');
      if (geoVal && coords) {
        geoVal.textContent = `COORDINATES: ${coords}`;
      }
    });

    // Hover effect: pre-load coords or temp coordinate shift
    item.addEventListener('mouseenter', () => {
      const coords = item.getAttribute('data-coords');
      if (geoVal && coords && !item.classList.contains('active')) {
        geoVal.style.color = 'var(--color-accent-terracotta)';
        geoVal.textContent = `TARGET: ${coords}`;
      }
    });

    item.addEventListener('mouseleave', () => {
      if (geoVal) {
        geoVal.style.color = '';
        // Revert to active item coords
        const activeItem = document.querySelector('.index-item.active');
        if (activeItem) {
          geoVal.textContent = `COORDINATES: ${activeItem.getAttribute('data-coords')}`;
        }
      }
    });
  });

  // --- DYNAMIC ALTITUDE TRACKER ---
  const altitudeVal = document.getElementById('altitude-val');
  const minAltitude = 2100; // Starting altitude (m)
  const maxAltitude = 3776; // Mt Fuji/Summits (m)

  function updateAltitude() {
    if (!altitudeVal) return;
    
    // Calculate scroll percentage
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    
    // Interpolate altitude
    const currentAltitude = Math.round(minAltitude + (scrollPercent * (maxAltitude - minAltitude)));
    
    // Animate counter slightly with random jitter (cinematic tech style)
    const jitter = Math.random() > 0.85 ? Math.floor(Math.random() * 5) - 2 : 0;
    const displayAltitude = currentAltitude + jitter;
    
    altitudeVal.textContent = `${displayAltitude}M`;
  }

  window.addEventListener('scroll', updateAltitude, { passive: true });
  updateAltitude(); // Initial run

  // --- INQUIRY FORM INTERACTION ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitText = submitBtn.querySelector('span');
      
      // Tactile Loading State
      submitText.textContent = 'TRANSMITTING SIGNAL...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitText.textContent = 'TRANSMISSION COMPLETE';
        submitBtn.style.backgroundColor = 'var(--color-accent-terracotta)';
        submitBtn.style.color = '#fff';
        submitBtn.style.opacity = '1';
        
        setTimeout(() => {
          contactForm.reset();
          submitText.textContent = 'TRANSMIT INQUIRY';
          submitBtn.style.backgroundColor = 'var(--color-text-chocolate)';
          submitBtn.style.color = 'var(--color-bg-ivory)';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
