
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

let mostrandoReversos = false;

function alternarCartas() {
  const cartas = document.querySelectorAll('.carta');
  const titulo = document.getElementById('titulo');
  const btn = document.getElementById('alternarBtn');

  if (!mostrandoReversos) {
    // Mostrar los reversos
    cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(-180deg)';
      trasera.style.transform = 'rotateY(0deg)';
    });
    titulo.textContent = 'Descubre los amigos';
    btn.textContent = 'Mostrar Amigos';
    mostrandoReversos = true;
  } else {
    // Mostrar los anversos
    cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(0deg)';
      trasera.style.transform = 'rotateY(180deg)';
    });
    titulo.textContent = 'Descubre las Profesiones';
    btn.textContent = 'Mostrar Profesiones';
    mostrandoReversos = false;
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




