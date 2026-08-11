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

  // --- 4. FORM INTERACTION (Swiss style minimal states) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      
      // Minimal text loading feedback
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.style.opacity = '0.6';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'INQUIRY TRANSMITTED';
        submitBtn.style.backgroundColor = '#666666';
        submitBtn.style.color = '#ffffff';
        submitBtn.style.opacity = '1';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 2500);
      }, 1200);
    });
  }
});
