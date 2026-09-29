/* ============================================
   BOOMIKA M — 3D INTERACTIVE PORTFOLIO JS (THREE.JS + VANILLA TILT)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1000);

  // ===== THREE.JS 3D WEBGL GRAPHICS SYSTEM =====
  function initThreeJS() {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. 3D Wireframe TorusKnot Data Core
    const geometry = new THREE.TorusKnotGeometry(8, 2.5, 120, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // 3. 3D Dynamic Particle Neural Network Constellation
    const particleCount = 450;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x2563eb); // Primary Blue
    const color2 = new THREE.Color(0x38bdf8); // Cyan Accent

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 4. Mouse Interactive Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.01;
      mouseY = (e.clientY - windowHalfY) * 0.01;
    });

    // 5. 3D Render Loop
    function animate3D() {
      requestAnimationFrame(animate3D);

      // Smooth camera parallax easing
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Continuous 3D Core Rotation
      torusKnot.rotation.x += 0.003;
      torusKnot.rotation.y += 0.005;
      particleSystem.rotation.y += 0.001;

      renderer.render(scene, camera);
    }
    animate3D();

    // 6. Handle Window Resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initThreeJS();

  // ===== VANILLA TILT 3D CARD INITIALIZATION =====
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02
    });
  }

  // ===== TOP SCROLL PROGRESS BAR & NAVBAR =====
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }

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

    // ScrollSpy active link tracking
    sections.forEach(section => {
      const top = section.offsetTop - 140;
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

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== MOBILE NAV =====
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
      if (window.mySandboxChart) {
        updateChartColors(next);
      }
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // ===== TYPING ANIMATION =====
  const words = ['Data Analytics & 3D Web', 'Python ETL & Automation', 'Power BI & DAX', 'Machine Learning Models'];
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

    let speed = isDeleting ? 40 : 90;

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

  setTimeout(typeEffect, 800);

  // ===== HERO TERMINAL TAB SWITCHER =====
  window.switchTermTab = (tab) => {
    const tabs = document.querySelectorAll('.term-tab');
    const pyBox = document.getElementById('termCodePy');
    const sqlBox = document.getElementById('termCodeSql');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'py') {
      tabs[0].classList.add('active');
      pyBox.style.display = 'block';
      sqlBox.style.display = 'none';
    } else {
      tabs[1].classList.add('active');
      pyBox.style.display = 'none';
      sqlBox.style.display = 'block';
    }
  };

  // ===== COPY EMAIL TO CLIPBOARD =====
  window.copyEmail = () => {
    const email = "boomikamadhavan077@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const btnText = document.getElementById('copyEmailText');
      if (btnText) {
        btnText.textContent = "Copied to Clipboard!";
        setTimeout(() => { btnText.textContent = "Copy Email"; }, 2500);
      }
    });
  };

  // ===== CHART.JS INTERACTIVE SANDBOX =====
  let sandboxChart = null;

  const chartDataConfigs = {
    churn: {
      type: 'doughnut',
      labels: ['Retained Customers', 'At-Risk Churn', 'High Risk Churn'],
      datasets: [{
        data: [78, 14, 8],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 2,
        borderColor: '#0F172A'
      }],
      insight: '<strong>ChurnGuard 3D Insight:</strong> Random Forest model flags customer churn risk with 94.2% precision, enabling targeted retention campaigns before contract expiry.'
    },
    sales: {
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'Actual Revenue ($k)',
          data: [42, 48, 55, 52, 60, 68, 72, 80],
          borderColor: '#38BDF8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'ML Forecast ($k)',
          data: [42, 48, 55, 52, 62, 70, 76, 85],
          borderColor: '#2563EB',
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ],
      insight: '<strong>Sales Forecast Model:</strong> Time-series ML model accurately projected Q2 revenue growth with < 3.2% Mean Absolute Percentage Error (MAPE).'
    },
    ml: {
      type: 'bar',
      labels: ['Logistic Reg', 'Decision Tree', 'Random Forest', 'XGBoost Benchmark'],
      datasets: [{
        label: 'Accuracy Rate (%)',
        data: [76.5, 82.0, 94.2, 95.1],
        backgroundColor: ['rgba(56, 189, 248, 0.5)', 'rgba(37, 99, 235, 0.6)', '#10B981', 'rgba(56, 189, 248, 0.9)'],
        borderRadius: 8
      }],
      insight: '<strong>Model Comparison:</strong> Random Forest Classifier optimized with 5-fold Cross Validation produced optimal balance between accuracy and computational overhead.'
    }
  };

  function initSandboxChart() {
    const ctx = document.getElementById('sandboxChart');
    if (!ctx) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const textColor = currentTheme === 'light' ? '#1E293B' : '#F8FAFC';

    sandboxChart = new Chart(ctx, {
      type: chartDataConfigs.churn.type,
      data: {
        labels: chartDataConfigs.churn.labels,
        datasets: chartDataConfigs.churn.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } }
        }
      }
    });

    window.mySandboxChart = sandboxChart;
  }

  function updateChartColors(theme) {
    if (!sandboxChart) return;
    const textColor = theme === 'light' ? '#1E293B' : '#F8FAFC';
    if (sandboxChart.options.plugins.legend) {
      sandboxChart.options.plugins.legend.labels.color = textColor;
    }
    sandboxChart.update();
  }

  window.updateSandboxChart = (key) => {
    const tabs = document.querySelectorAll('.sandbox-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const activeTabMap = { churn: 0, sales: 1, ml: 2 };
    if (tabs[activeTabMap[key]]) {
      tabs[activeTabMap[key]].classList.add('active');
    }

    const config = chartDataConfigs[key];
    const insightsEl = document.getElementById('sandboxInsights');
    if (insightsEl) {
      insightsEl.innerHTML = `<div class="insight-pill"><i class="fas fa-lightbulb"></i> ${config.insight}</div>`;
    }

    if (sandboxChart) {
      sandboxChart.config.type = config.type;
      sandboxChart.data.labels = config.labels;
      sandboxChart.data.datasets = config.datasets;
      sandboxChart.update();
    }
  };

  initSandboxChart();

  // ===== INTERSECTION OBSERVER FOR AOS =====
  const aosElements = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  // ===== ANIMATED SKILL BARS =====
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = width + '%'; }, 100);
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ===== STAT COUNTERS =====
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1500);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

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

  // ===== SKILL CATEGORY FILTER =====
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
          setTimeout(() => { cat.style.opacity = '1'; cat.style.transform = 'translateY(0)'; }, 30);
        } else {
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(15px)';
          setTimeout(() => { cat.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // ===== PROJECT CATEGORY FILTER & INSTANT SEARCH =====
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  window.filterProjectsBySearch = () => {
    filterProjects();
  };

  function filterProjects() {
    const activeBtn = document.querySelector('.project-filter-btn.active');
    const pfilter = activeBtn ? activeBtn.getAttribute('data-pfilter') : 'all';
    const searchVal = (document.getElementById('projectSearch')?.value || '').toLowerCase().trim();

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-pcategory') || '';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (pfilter === 'all' || categories.includes(pfilter));
      const matchesSearch = (!searchVal || cardText.includes(searchVal));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });
  }

  // ===== CODE SNIPPETS SWITCHER =====
  window.switchSnippet = (key) => {
    const tabs = document.querySelectorAll('.snippet-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const tabMap = { etl: 0, sql: 1, ml: 2 };
    if (tabs[tabMap[key]]) tabs[tabMap[key]].classList.add('active');

    const etlBox = document.getElementById('snippetEtl');
    const sqlBox = document.getElementById('snippetSql');
    const mlBox = document.getElementById('snippetMl');

    if (etlBox) etlBox.style.display = key === 'etl' ? 'block' : 'none';
    if (sqlBox) sqlBox.style.display = key === 'sql' ? 'block' : 'none';
    if (mlBox) mlBox.style.display = key === 'ml' ? 'block' : 'none';
  };

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

  // ===== CERTIFICATE LIGHTBOX MODAL =====
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
      img.onload = () => { img.classList.add('loaded'); placeholder.classList.add('hidden'); };
      img.onerror = () => { img.classList.remove('loaded'); placeholder.classList.remove('hidden'); };

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

  // ===== RESUME DOWNLOAD TRACKING =====
  const resumeBtns = document.querySelectorAll('#downloadResumeBtn');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.trackResumeDownload === 'function') {
        window.trackResumeDownload();
      }
    });
  });

});
