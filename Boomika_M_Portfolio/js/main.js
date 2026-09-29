/* ============================================
   BOOMIKA M — 3D INTERACTIVE WEBGL ENGINE (THREE.JS + ORBIT CONTROLS)
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

  // ===== 1. INTERACTIVE 3D HERO MODEL ENGINE WITH ORBIT CONTROLS =====
  let heroControls = null;
  let heroCamera = null;

  function initHero3DCanvas() {
    const container = document.querySelector('.canvas-3d-wrapper');
    const canvas = document.getElementById('hero3DCanvas');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // 3D Scene & Camera
    const scene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    heroCamera.position.set(0, 0, 18);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Three.js OrbitControls for 360 Degree Mouse Dragging & Zooming
    if (typeof THREE.OrbitControls !== 'undefined') {
      heroControls = new THREE.OrbitControls(heroCamera, renderer.domElement);
      heroControls.enableDamping = true;
      heroControls.dampingFactor = 0.05;
      heroControls.rotateSpeed = 0.8;
      heroControls.zoomSpeed = 0.8;
      heroControls.enableZoom = true;
      heroControls.maxDistance = 30;
      heroControls.minDistance = 10;
    }

    // 3D Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x2563eb, 2, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 12, 10);
    scene.add(dirLight);

    // 3D Object Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Metallic Core Sphere
    const innerGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // Outer 3D Wireframe Icosahedron Cage
    const cageGeo = new THREE.IcosahedronGeometry(5.2, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cage);

    // 3 Orbital Rings (Armillary Sphere Effect)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.08, 16, 100), ringMat);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(7.2, 0.08, 16, 100), ringMat);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(7.8, 0.08, 16, 100), ringMat);

    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.x = -Math.PI / 4;

    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(ring3);

    // Floating 3D Satellite Nodes
    const satCount = 8;
    const satGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.6);
    const satMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.5 });

    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 8.5;
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.position.set(Math.cos(angle) * radius, Math.sin(angle) * 2, Math.sin(angle) * radius);
      satGroup.add(sat);
    }
    coreGroup.add(satGroup);

    // 3D Render Loop
    function animateHero3D() {
      requestAnimationFrame(animateHero3D);

      if (heroControls) {
        heroControls.update();
      } else {
        coreGroup.rotation.y += 0.008;
      }

      cage.rotation.x += 0.004;
      cage.rotation.y += 0.006;

      ring1.rotation.z += 0.005;
      ring2.rotation.x += 0.004;
      ring3.rotation.y += 0.006;

      satGroup.rotation.y -= 0.008;

      renderer.render(scene, heroCamera);
    }
    animateHero3D();

    // Resize Handler
    window.addEventListener('resize', () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 360;
      heroCamera.aspect = w / h;
      heroCamera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  initHero3DCanvas();

  window.reset3DCamera = () => {
    if (heroCamera && heroControls) {
      heroCamera.position.set(0, 0, 18);
      heroControls.reset();
    }
  };

  // ===== 2. THREE.JS BACKGROUND AMBIENT PARTICLES =====
  function initBg3DCanvas() {
    const canvas = document.getElementById('bg3DCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 120;
      positions[i + 2] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ size: 1.5, color: 0x38bdf8, transparent: true, opacity: 0.4 });
    const pSystem = new THREE.Points(geometry, material);
    scene.add(pSystem);

    function animateBg() {
      requestAnimationFrame(animateBg);
      pSystem.rotation.y += 0.0008;
      pSystem.rotation.x += 0.0004;
      renderer.render(scene, camera);
    }
    animateBg();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initBg3DCanvas();

  // ===== 3. VANILLA TILT 3D BINDINGS =====
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.18,
      scale: 1.02
    });
  }

  // ===== 4. 3D CARD FLIP HANDLER =====
  window.toggle3DFlip = (btn) => {
    const cardInner = btn.closest('.flip-card-inner') || btn.closest('.flip-card-container')?.querySelector('.flip-card-inner');
    if (cardInner) {
      cardInner.classList.toggle('flipped');
    }
  };

  // ===== 5. TOP SCROLL PROGRESS BAR & NAVBAR =====
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
  const words = ['3D Interactive Data Web', 'Python ETL & Automation', 'Power BI & DAX', 'Machine Learning Models'];
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
  const projectCards = document.querySelectorAll('.flip-card-container');

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
        card.style.display = 'block';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
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
  const resumeBtns = document.querySelectorAll('#downloadResumeBtn');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.trackResumeDownload === 'function') {
        window.trackResumeDownload();
      }
    });
  });

});
