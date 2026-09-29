/* ============================================
   BOOMIKA M — PROFESSIONAL PORTFOLIO JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1200);

  // ===== NAVBAR & SCROLL SPY =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

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

    // ScrollSpy active state
    sections.forEach(section => {
      const top = section.offsetTop - 130;
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

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  if (hamburger && navLinksContainer) {
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
  }

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // ===== TYPING ANIMATION EFFECT =====
  const words = ['Data Analyst', 'Python Developer', 'AI & ML Engineer', 'Business Intelligence Specialist'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typedText');

  function typeEffect() {
    if (!typedEl) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 300;
    }

    setTimeout(typeEffect, speed);
  }

  setTimeout(typeEffect, 1000);

  // ===== INTERSECTION OBSERVER FOR AOS ANIMATIONS =====
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  // ===== ANIMATED SKILL BARS =====
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 150);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ===== STAT COUNTER ANIMATION =====
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1600);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * easedProgress);
      if (progress < 1) requestAnimationFrame(updateCounter);
    }
    requestAnimationFrame(updateCounter);
  }

  // ===== SKILLS CATEGORY FILTER =====
  const skillFilterBtns = document.querySelectorAll('.filter-btn');
  const skillCategories = document.querySelectorAll('.skill-category');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCategories.forEach(cat => {
        const catGroup = cat.getAttribute('data-category');
        if (filter === 'all' || catGroup === filter) {
          cat.style.display = 'block';
          setTimeout(() => { cat.style.opacity = '1'; cat.style.transform = 'translateY(0)'; }, 50);
        } else {
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(20px)';
          setTimeout(() => { cat.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== PROJECT CATEGORY FILTER =====
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pfilter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-pcategory') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== PROJECT MODAL LOGIC =====
  window.openProjectModal = (title, desc, tags, demoUrl, githubUrl) => {
    document.getElementById('pModalTitle').textContent = title;
    document.getElementById('pModalDesc').textContent = desc;

    const tagsContainer = document.getElementById('pModalTags');
    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'ptag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    const demoBtn = document.getElementById('pModalDemoBtn');
    if (demoUrl && demoUrl !== '#') {
      demoBtn.href = demoUrl;
      demoBtn.style.display = 'inline-flex';
    } else {
      demoBtn.style.display = 'none';
    }

    const githubBtn = document.getElementById('pModalGithubBtn');
    if (githubUrl && githubUrl !== '#') {
      githubBtn.href = githubUrl;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }

    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = () => {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // ===== CERTIFICATE MODAL LOGIC =====
  window.openCertModal = (shortName, title, desc, file) => {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;

    const modal = document.getElementById('certModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const img = document.getElementById('certModalImg');
    const placeholder = document.getElementById('certImgPlaceholder');
    const downloadBtn = document.getElementById('certDownloadBtn');

    if (file && file !== '#') {
      img.classList.remove('loaded');
      placeholder.classList.remove('hidden');
      img.src = file;
      img.onload = () => {
        img.classList.add('loaded');
        placeholder.classList.add('hidden');
      };
      img.onerror = () => {
        img.classList.remove('loaded');
        placeholder.classList.remove('hidden');
      };

      if (downloadBtn) {
        downloadBtn.href = file;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.pointerEvents = 'auto';
      }
    } else {
      img.src = '';
      img.classList.remove('loaded');
      placeholder.classList.remove('hidden');
      if (downloadBtn) {
        downloadBtn.href = '#';
        downloadBtn.style.opacity = '0.5';
        downloadBtn.style.pointerEvents = 'none';
      }
    }
  };

  window.closeCertModal = () => {
    const modal = document.getElementById('certModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeProjectModal();
      window.closeCertModal();
    }
  });

  // ===== CONTACT FORM SUBMISSION =====
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
    submitLoading.style.display = 'inline-flex';
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
      console.error("Form error:", err);
      errorMsg.style.display = 'flex';
    } finally {
      btn.disabled = false;
      submitText.style.display = 'inline-flex';
      submitLoading.style.display = 'none';
    }
  };

  // ===== RESUME TRACKING =====
  const resumeBtns = document.querySelectorAll('#downloadResumeBtn, #downloadResumeBtn2');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.trackResumeDownload === 'function') {
        window.trackResumeDownload();
      }
      const countEl = document.getElementById('downloadCount');
      if (countEl) {
        countEl.textContent = parseInt(countEl.textContent, 10) + 1;
      }
    });
  });

  // ===== DYNAMIC MOUSE GLOW FOR CARDS =====
  document.querySelectorAll('.project-card, .cert-card, .achievement-card, .about-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ===== HERO PARTICLES =====
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation-duration: ${Math.random() * 12 + 6}s;
        animation-delay: ${Math.random() * 6}s;
        opacity: ${Math.random() * 0.4 + 0.2};
      `;
      container.appendChild(p);
    }
  }
  initParticles();

});
