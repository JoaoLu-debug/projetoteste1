document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. SCROLL-REVEAL OBSERVER ---
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

  // --- 2. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --- 3. INTERACTIVE PROJECTS INDEX ---
  const projectRows = document.querySelectorAll('.project-row');
  const heroHeroImage = document.querySelector('#home .editorial-img');

  projectRows.forEach(row => {
    row.addEventListener('click', () => {
      // Collapse previous active row
      projectRows.forEach(otherRow => {
        otherRow.classList.remove('active');
      });
      // Expand current clicked row
      row.classList.add('active');

      // Update hero section main image to preview this project
      const imgPath = row.getAttribute('data-img');
      if (heroHeroImage && imgPath) {
        heroHeroImage.style.opacity = '0.4';
        setTimeout(() => {
          heroHeroImage.src = imgPath;
          heroHeroImage.style.opacity = '1';
        }, 200);
      }
    });
  });

  // --- 4. PERFORMANT PARALLAX SCROLL EFFECT ---
  const parallaxImages = document.querySelectorAll('.parallax-img');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    const viewHeight = window.innerHeight;
    
    parallaxImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      // Check if image is visible in viewport
      if (rect.top < viewHeight && rect.bottom > 0) {
        // Calculate vertical center offset
        const imgHeight = rect.height || img.offsetHeight;
        const imgCenter = rect.top + imgHeight / 2;
        const viewCenter = viewHeight / 2;
        
        // Offset mapping factor
        const offset = (imgCenter - viewCenter) * 0.08;
        // Apply smooth scale and translation parallax shift
        img.style.transform = `scale(1.15) translateY(${offset}px)`;
      }
    });
    
    ticking = false;
  }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  if (parallaxImages.length > 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial run to layout elements correctly
    window.requestAnimationFrame(updateParallax);
  }

  // --- 5. FORM INTERACTION (Swiss minimal link state) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      
      // Minimal text feedback
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.style.opacity = '0.5';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'TRANSMITTED';
        submitBtn.style.opacity = '1';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          // Trigger scroll-recalculation in case layout shifted slightly
          window.requestAnimationFrame(updateParallax);
        }, 2500);
      }, 1200);
    });
  }
});
