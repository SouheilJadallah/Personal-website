// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { threshold: 0.15 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Scroll progress bar
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

// Cursor glow follow
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--after-x', e.pageX + "px");
  document.body.style.setProperty('--after-y', e.pageY + "px");
});
// Typing effect for About page
const typingElement = document.getElementById("typing");
if (typingElement) {
  const roles = ["Web Developer", "Problem Solver", "Lifelong Learner"];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    const current = roles[roleIndex];
    if (!deleting) {
      typingElement.textContent = current.slice(0, charIndex++);
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(typeEffect, 1500);
        return;
      }
    } else {
      typingElement.textContent = current.slice(0, charIndex--);
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeEffect, deleting ? 60 : 100);
  }

  typeEffect();
}
