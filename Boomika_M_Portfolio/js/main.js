/* ============================================
   BOOMIKA M — PORTFOLIO MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1600);

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== MOBILE NAV =====
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // ===== TYPING EFFECT =====
  const words = ['Data Analyst', 'Python Developer', 'AI Enthusiast', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typedText');

  function type() {
    if (!typedEl) return;
    const current = words[wordIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 110;

    if (!isDeleting && charIndex === current.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1200);

  // ===== SCROLL REVEAL (AOS manual) =====
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  // ===== SKILL BARS =====
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ===== COUNTER ANIMATION =====
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, 0, target, 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== SMOOTH NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== CONTACT FORM =====
  window.submitForm = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    btn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'flex';
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
      let success = false;

      if (typeof window.submitFormFirebase === 'function') {
        success = await window.submitFormFirebase(formData);
      }

      if (success) {
        successMsg.style.display = 'flex';
        document.getElementById('contactForm').reset();
      } else {
        errorMsg.style.display = 'flex';
      }
    } catch (err) {
      console.error(err);
      errorMsg.style.display = 'flex';
    } finally {
      btn.disabled = false;
      submitText.style.display = 'flex';
      submitLoading.style.display = 'none';
    }
  };

  // ===== RESUME DOWNLOAD TRACKING =====
  const resumeBtns = document.querySelectorAll('#downloadResumeBtn, #downloadResumeBtn2');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.trackResumeDownload === 'function') {
        window.trackResumeDownload();
      }
      const countEl = document.getElementById('downloadCount');
      if (countEl) {
        countEl.textContent = parseInt(countEl.textContent) + 1;
      }
    });
  });

  // ===== CERTIFICATE MODAL =====
    window.openCertModal = (shortName, title, desc, file) => {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('certModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    const img = document.getElementById('certModalImg');
    const placeholder = document.getElementById('certImgPlaceholder');
    if (file && file !== '#') {
      img.classList.remove('loaded');
      placeholder.classList.remove('hidden');
      img.src = file;
      img.onload = () => { img.classList.add('loaded'); placeholder.classList.add('hidden'); };
      img.onerror = () => { img.classList.remove('loaded'); placeholder.classList.remove('hidden'); };
    } else {
      img.src = ''; img.classList.remove('loaded'); placeholder.classList.remove('hidden');
    }
    const btn = document.getElementById('certDownloadBtn');
    if (btn) {
      if (file && file !== '#') { btn.href = file; btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
      else { btn.href = '#'; btn.style.opacity = '0.5'; btn.style.pointerEvents = 'none'; }
    }
  };




  window.closeCertModal = () => {
    document.getElementById('certModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeCertModal();
  });

  // ===== PARTICLES (lightweight) =====
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation-duration: ${Math.random() * 15 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: 0.3;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ===== CARD GLOW EFFECT =====
  document.querySelectorAll('.project-card, .cert-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ===== ACTIVE SECTION HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(sec => navObserver.observe(sec));

  console.log('%c Boomika M Portfolio ', 'background:#2563EB;color:#fff;font-size:1.2rem;padding:0.5rem 1rem;border-radius:8px;font-weight:bold;');
  console.log('%c Built with ❤️ | AI & Data Science Portfolio ', 'color:#38BDF8;font-size:0.9rem;');
});
