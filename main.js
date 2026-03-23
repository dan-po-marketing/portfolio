// === Scroll fade-in animations ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// === Expandable "Under the Hood" ===
document.querySelectorAll('.expandable__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    trigger.setAttribute('aria-expanded', !isOpen);

    if (isOpen) {
      content.style.maxHeight = '0';
      content.classList.remove('is-open');
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      content.classList.add('is-open');
    }
  });
});

// === Metric count-up animation ===
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/^([+\-]?)(\$?)([\d,]+(?:\.\d+)?)(.*)/);
      if (!match) return;

      const [, sign, prefix, numStr, suffix] = match;
      const target = parseFloat(numStr.replace(/,/g, ''));
      const hasCommas = numStr.includes(',');
      const duration = 800;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);

        let formatted = hasCommas ? current.toLocaleString() : current.toString();
        el.textContent = sign + prefix + formatted + suffix;

        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      metricObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.metric-card__number').forEach(el => metricObserver.observe(el));
