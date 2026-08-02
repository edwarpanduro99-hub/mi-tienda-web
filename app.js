let currentSlide = 0;

function moverSlide(direccion) {
  const wrapper = document.getElementById("slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  if (!wrapper || slides.length === 0) return;

  currentSlide += direccion;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  } else if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}