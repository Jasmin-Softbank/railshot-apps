const eyes = [...document.querySelectorAll('[data-eye]')];
const maxTravel = 30;

function followPointer(x, y) {
  eyes.forEach((eye) => {
    const iris = eye.querySelector('.iris');
    const box = eye.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const angle = Math.atan2(y - centerY, x - centerX);
    const distance = Math.min(maxTravel, Math.hypot(x - centerX, y - centerY) / 7);
    iris.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
  });
}

window.addEventListener('pointermove', (event) => followPointer(event.clientX, event.clientY), { passive: true });
window.addEventListener('pointerleave', () => eyes.forEach((eye) => { eye.querySelector('.iris').style.transform = ''; }));
