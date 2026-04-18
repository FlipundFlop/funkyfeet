// Funky Feet — small interactions & animations

// Reveal sections as they scroll into view
const revealables = document.querySelectorAll('.section, .card, .schedule__card, .location');
revealables.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealables.forEach((el) => io.observe(el));

// Confetti burst on CTA clicks + form submit
const EMOJIS = ['⭐', '💖', '✨', '🎵', '🌈', '🎉', '💫', '👟'];

function confettiBurst(x, y) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    piece.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${14 + Math.random() * 14}px;
      pointer-events: none;
      z-index: 9999;
      transition: transform 1.1s ease-out, opacity 1.1s ease-out;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 140;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;

    requestAnimationFrame(() => {
      piece.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random() * 540}deg)`;
      piece.style.opacity = '0';
    });

    setTimeout(() => piece.remove(), 1200);
  }
}

document.querySelectorAll('.btn--primary, .nav__cta').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

// Contact form — friendly mailto fallback so it works without a backend
const form = document.getElementById('contactForm');
const hint = document.getElementById('formHint');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const age = (data.get('age') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email) {
      hint.textContent = 'Please add your name and email so we can reply. 🙏';
      hint.classList.add('error');
      return;
    }

    const subject = encodeURIComponent(`Funky Feet — trial request from ${name}`);
    const body = encodeURIComponent(
      `Hi Funky Feet team!\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Child's age: ${age || '(not given)'}\n\n` +
      `${message || "I'd love more info about a free trial."}\n`
    );

    window.location.href = `mailto:hello@funkyfeet.example?subject=${subject}&body=${body}`;

    hint.classList.remove('error');
    hint.textContent = "Your email app should open now. Can't wait to hear from you! 💃";

    const rect = form.getBoundingClientRect();
    confettiBurst(rect.left + rect.width / 2, rect.top + 100);
  });
}

// Tiny parallax on floating shapes
const shapes = document.querySelectorAll('.shape');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  shapes.forEach((s, i) => {
    const depth = (i % 3 + 1) * 0.4;
    s.style.translate = `${x * depth}px ${y * depth}px`;
  });
}, { passive: true });
