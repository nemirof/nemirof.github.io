
function mostrarProfesion(carta) {
  const frontal = carta.querySelector('.frontal');
  const trasera = carta.querySelector('.trasera');
  const sound = trasera.querySelector('.sound');

  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    trasera.style.transform = 'rotateY(180deg)';
  } else {
    frontal.style.transform = 'rotateY(-180deg)';
    trasera.style.transform = 'rotateY(0deg)';
	
    // Verificar si el atributo 'data-src' existe antes de cargar el audio
    if (sound.hasAttribute('data-src')) {
      const audioSrc = sound.getAttribute('data-src');
      sound.setAttribute('src', audioSrc);
      sound.removeAttribute('data-src');
    }
    sound.play();
  }
}


function moverImagen() {
  const imagen = document.querySelector('.imagen-conductora');
  const audioArranque = document.getElementById('audio-arranque');

  imagen.style.transform = 'translateX(-200%)'; // Ajusta el porcentaje según sea necesario
  audioArranque.play(); // Reproduce el audio

  setTimeout(function() {
    window.location.href = 'profesiones.html'; // Redirige al usuario después de la animación
  }, 2000); // Ajusta el tiempo según la duración de la transición en CSS o la duración del audio
}




