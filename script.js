/* ==========================================================================
   Souheil Jadallah — portfolio interactions
   Every block guards for the elements it needs, so one shared file works
   across every page without throwing on pages that lack a feature.
   ========================================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------------- */
(() => {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();

/* --------------------------------------------------------------------------
   Navbar: solid-on-scroll + mobile menu
   -------------------------------------------------------------------------- */
(() => {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.navbar ul');

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();

/* --------------------------------------------------------------------------
   Back to top
   -------------------------------------------------------------------------- */
(() => {
  const btn = document.getElementById('to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();

/* --------------------------------------------------------------------------
   Scroll reveal — reveals once, then stops observing.
   Siblings inside [data-stagger] get an incremental delay.
   -------------------------------------------------------------------------- */
(() => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 90;
    group.querySelectorAll(':scope > .reveal').forEach((el, i) => {
      el.style.setProperty('--delay', i * step + 'ms');
    });
  });

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach((el) => observer.observe(el));
})();

/* --------------------------------------------------------------------------
   Skill bars — fill when scrolled into view
   -------------------------------------------------------------------------- */
(() => {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  if (!bars.length) return;

  const fill = (bar) => { bar.style.width = bar.dataset.width; };

  if (reduceMotion) {
    bars.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => fill(entry.target), i * 120);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  bars.forEach((bar) => observer.observe(bar));
})();

/* --------------------------------------------------------------------------
   Count-up stats
   -------------------------------------------------------------------------- */
(() => {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';

    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    let startTime = null;

    const step = (now) => {
      if (startTime === null) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  nums.forEach((el) => observer.observe(el));
})();

/* --------------------------------------------------------------------------
   Typing effect
   -------------------------------------------------------------------------- */
(() => {
  const el = document.getElementById('typing');
  if (!el) return;

  const roles = (el.dataset.roles || 'Software Developer')
    .split('|')
    .map((r) => r.trim())
    .filter(Boolean);

  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 320);
        return;
      }
    } else {
      charIndex += 1;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 1700);
        return;
      }
    }

    setTimeout(tick, deleting ? 45 : 85);
  };

  tick();
})();

/* --------------------------------------------------------------------------
   Card spotlight — tracks the pointer for the radial highlight
   -------------------------------------------------------------------------- */
(() => {
  const cards = document.querySelectorAll('.card');
  if (!cards.length || reduceMotion) return;

  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - rect.left + 'px');
      card.style.setProperty('--my', e.clientY - rect.top + 'px');
    });
  });
})();

/* --------------------------------------------------------------------------
   Project cards — tap/click to flip (hover alone is useless on touch)
   -------------------------------------------------------------------------- */
(() => {
  document.querySelectorAll('.project-card').forEach((card) => {
    const flip = () => card.classList.toggle('flipped');

    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });
})();

