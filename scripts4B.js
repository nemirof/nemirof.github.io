let profesionMostrada = false;
let mostrandoReversos = false;
let isMuted = false;
sessionStorage.setItem('profesionAleatoria', null);

const profesiones = [
  "Frutera", "Panadero", "Carnicero", "Pescadera", "Cocinero", 
  "Camarero", "Policía", "Bombero", "Obrero", "Fontanero", 
  "Veterinario", "Veterinaria", "Peluquero", "Peluquero", "Músico", 
  "Cantante", "Actriz", "Actor", "Cartera", "Cartera"
];

const imagenes = [
  "images/frutera.jpg",
  "images/panadero.jpg",
  "images/carnicero.jpg",
  "images/pescadera.jpg",
  "images/cocinero.jpg",
  "images/camarero.jpg",
  "images/policiaa.jpg",
  "images/bombero.jpg",
  "images/obrero.jpg",
  "images/fontanero.jpg",
  "images/veterinario.jpg",
  "images/veterinaria.jpg",
  "images/peluquero.jpg",
  "images/peluquera.jpg",
  "images/musicoo.jpg",
  "images/cantanteo.jpg",
  "images/actriz.jpg",
  "images/actor.jpg",
  "images/cartera.jpg",
  "images/cartera.jpg"
];

function hacerPregunta() {
  // Generar un índice aleatorio basado en la longitud del array de profesiones
  mostrarAmigos();
  const indiceAleatorio = Math.floor(Math.random() * profesiones.length);
  sessionStorage.setItem('profesionAleatoria', profesiones[indiceAleatorio]);
  sessionStorage.setItem('imagenAleatoria', imagenes[indiceAleatorio]);
  const mensaje = `Busca un(a) ${profesiones[indiceAleatorio]}.`;
  document.getElementById('mensajeAcierto').style.background = "none";
  document.getElementById('mensajeFallo').innerText = "";
  document.getElementById('mensajeAcierto').innerText = "";
  //document.getElementById('mensajeFallo').style.display = 'none'; // Oculta el mensaje de fallo
  //document.getElementById('mensajeAcierto').style.display = 'none'; // Oculta el mensaje de fallo

  mostrarPregunta('mensajeProfesion', mensaje);
  mostrarImagen(imagenes[indiceAleatorio]);
  profesionMostrada = true; // Se muestra la profesión
}

function ocultarMensajes() {
  const mensajes = document.querySelectorAll('.mensaje');
  mensajes.forEach(mensaje => {
    mensaje.style.display = 'none'; // Oculta todos los mensajes
  });
  profesionMostrada = false; // Reinicia el estado de la profesión mostrada
}

function mostrarImagen(imagenSrc) {
  const imagenProfesion = document.getElementById("imagenProfesion");
  imagenProfesion.src = imagenSrc;
  imagenProfesion.style.display = 'block';
}

function mostrarPregunta(elementoId, mensaje) {
  const mensajeElemento = document.getElementById(elementoId);
  mensajeElemento.innerHTML = mensaje;
  mensajeElemento.style.display = 'block';
}

function mostrarMensaje(elementoId, mensaje) {
  const mensajeElemento = document.getElementById(elementoId);
  mensajeElemento.innerHTML = mensaje;
  mensajeElemento.style.display = 'block';
}


function mostrarMensajeAcierto() {
if (sessionStorage.getItem('profesionAleatoria') != 'null'){
	  mostrarMensaje('mensajeAcierto', '¡Has acertado!');
	  document.getElementById('mensajeAcierto').style.background = "darkseagreen";
	  document.getElementById('mensajeFallo').style.display = 'none'; // Oculta el mensaje de fallo
	  const audioExito = document.getElementById('audioExito');

	  audioExito.play();
	  
	  // Lanzar confeti cuando acierta
	  crearConfeti();
   }
}

function mostrarMensajeFallo() {
  if (sessionStorage.getItem('profesionAleatoria') != 'null'){
	  mostrarMensaje('mensajeFallo', 'Oh no, inténtalo otra vez');
	  document.getElementById('mensajeAcierto').style.display = 'none'; // Oculta el mensaje de fallo
  }
}

// Función para manejar la interacción del usuario al hacer clic en una carta
function verificarProfesionCarta(profesionCarta) {
  const profesionAleatoria = sessionStorage.getItem('profesionAleatoria');

  if (profesionCarta === profesionAleatoria) {
    mostrarMensajeAcierto();
  } else {
    mostrarMensajeFallo();
  }
}

document.getElementById('botonPregunta').addEventListener('click', function() {
  if (!profesionMostrada) {
    hacerPregunta();
  } else {
    ocultarMensajes();
  }
});

function mostrarProfesion(carta) {
  // Prevenir múltiples clicks rápidos
  if (carta.dataset.flipping === 'true') {
    return;
  }
  
  carta.dataset.flipping = 'true';
  
  const frontal = carta.querySelector('.frontal');
  const trasera = carta.querySelector('.trasera');
  const profesionCarta = trasera.querySelector('p').textContent;
  verificarProfesionCarta(profesionCarta);
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
    if (!isMuted) {
      sound.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  // Permitir nuevo click después de la animación
  setTimeout(() => {
    carta.dataset.flipping = 'false';
  }, 800);
}

function mostrarAmigos(){
	const cartas = document.querySelectorAll('.carta');
	cartas.forEach(carta => {
      const frontal = carta.querySelector('.frontal');
      const trasera = carta.querySelector('.trasera');
      frontal.style.transform = 'rotateY(0deg)';
      trasera.style.transform = 'rotateY(180deg)';
	});
}

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

window.addEventListener('load', () => {
  // Eliminar la profesión almacenada al cargar la página
  sessionStorage.removeItem('profesionAleatoria');
});

// Función para activar/desactivar el sonido
function toggleMute() {
  isMuted = !isMuted;
  const iconoMute = document.getElementById('icono-mute');
  const botonMute = document.querySelector('.boton-mute');
  
  if (isMuted) {
    iconoMute.textContent = '🔇';
    botonMute.classList.add('muted');
    // Detener todos los audios
    document.querySelectorAll('audio').forEach(audio => {
      audio.muted = true;
    });
  } else {
    iconoMute.textContent = '🔊';
    botonMute.classList.remove('muted');
    // Reactivar todos los audios
    document.querySelectorAll('audio').forEach(audio => {
      audio.muted = false;
    });
  }
  
  // Guardar el estado en localStorage
  localStorage.setItem('muteState', isMuted);
}

// Cargar el estado del mute al iniciar la página
window.addEventListener('DOMContentLoaded', () => {
  const savedMuteState = localStorage.getItem('muteState') === 'true';
  if (savedMuteState) {
    isMuted = true;
    toggleMute(); // Aplicar el estado guardado
  }
});

// Función para crear efecto de confeti
function crearConfeti() {
  const colores = ['var(--secondary-color)', 'var(--accent-color)', 'var(--success-color)', 'var(--primary-color)', 'var(--warning-color)'];
  const velocidades = ['rapido', 'lento', 'muy-lento', ''];
  
  // Crear 50 piezas de confeti
  for (let i = 0; i < 50; i++) {
    const confeti = document.createElement('div');
    confeti.className = 'confeti';
    
    // Posición aleatoria en el ancho de la pantalla
    confeti.style.left = Math.random() * window.innerWidth + 'px';
    
    // Velocidad aleatoria
    const velocidadAleatoria = velocidades[Math.floor(Math.random() * velocidades.length)];
    if (velocidadAleatoria) {
      confeti.classList.add(velocidadAleatoria);
    }
    
    // Delay aleatorio para que no caigan todos a la vez
    confeti.style.animationDelay = Math.random() * 2 + 's';
    
    // Añadir al DOM
    document.body.appendChild(confeti);
    
    // Eliminar después de la animación
    setTimeout(() => {
      if (confeti.parentNode) {
        confeti.parentNode.removeChild(confeti);
      }
    }, 6000);
  }
}

// Mejoras para dispositivos touch
document.addEventListener('DOMContentLoaded', function() {
  // Prevenir comportamiento por defecto en touch
  document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.carta')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Mejorar los clicks en las cartas
  const cartas = document.querySelectorAll('.carta');
  cartas.forEach(carta => {
    // Remover el onclick del HTML y usar addEventListener
    carta.removeAttribute('onclick');
    
    // Añadir event listener optimizado para touch
    carta.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mostrarProfesion(this);
    }, { passive: false });
    
    // Mantener compatibilidad con mouse
    carta.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mostrarProfesion(this);
    });
  });
});

