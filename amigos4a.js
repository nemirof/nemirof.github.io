let amigoMostrado = false;
let isMuted = false;
sessionStorage.setItem('amigoAleatorio', null);

const amigos = [
  "Samuel", "Sofía", "Elisa", "Benjamín", "Alba", 
  "Laura", "Jon", "Daniel", "Marcos", "Alan", 
  "Chloe", "Danna", "Aizan", "Samara", "Alicia", 
  "Eva", "Leo", "Carlos", "Arabia", "Noa"
];

const imagenes = [
  "images/samuel.jpg",
  "images/sofia.jpg",
  "images/elisa.jpg",
  "images/benjamin.jpg",
  "images/alba.jpg",
  "images/laura.jpg",
  "images/jon.jpg",
  "images/dani.jpg",
  "images/marcos.jpg",
  "images/alan.jpg",
  "images/chloe.jpg",
  "images/danna.jpg",
  "images/aizan.jpg",
  "images/samara.jpg",
  "images/alicia.jpg",
  "images/eva.jpg",
  "images/leo.jpg",
  "images/carlos.jpg",
  "images/arabia.jpg",
  "images/noa.jpg"
];

function hacerPregunta() {
  // Generar un índice aleatorio basado en la longitud del array de amigos
  mostrarAmigos();
  const indiceAleatorio = Math.floor(Math.random() * amigos.length);
  sessionStorage.setItem('amigoAleatorio', amigos[indiceAleatorio]);
  sessionStorage.setItem('imagenAleatoria', imagenes[indiceAleatorio]);
  const mensaje = `Busca a: ${amigos[indiceAleatorio]}`;
  document.getElementById('mensajeAcierto').style.background = "none";
  document.getElementById('mensajeFallo').innerText = "";
  document.getElementById('mensajeAcierto').innerText = "";

  mostrarPregunta('mensajeProfesion', mensaje);
  mostrarImagen(imagenes[indiceAleatorio]);
  amigoMostrado = true; // Se muestra el amigo
}

function ocultarMensajes() {
  const mensajes = document.querySelectorAll('.mensaje');
  mensajes.forEach(mensaje => {
    mensaje.style.display = 'none'; // Oculta todos los mensajes
  });
  amigoMostrado = false; // Reinicia el estado
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
  if (sessionStorage.getItem('amigoAleatorio') != 'null'){
    mostrarMensaje('mensajeAcierto', '¡Has acertado!');
    document.getElementById('mensajeAcierto').style.background = "darkseagreen";
    document.getElementById('mensajeFallo').style.display = 'none';
    const audioExito = document.getElementById('audioExito');

    if (!isMuted) {
      audioExito.play();
    }
    
    // Lanzar confeti cuando acierta
    crearConfeti();
  }
}

function mostrarMensajeFallo() {
  if (sessionStorage.getItem('amigoAleatorio') != 'null'){
    mostrarMensaje('mensajeFallo', 'Oh no, inténtalo otra vez');
    document.getElementById('mensajeAcierto').style.display = 'none';
  }
}

// Función para verificar si el amigo de la carta es el correcto
function verificarAmigoCarta(nombreCarta) {
  const amigoAleatorio = sessionStorage.getItem('amigoAleatorio');

  if (nombreCarta === amigoAleatorio) {
    return true; // Acierto
  } else {
    return false; // Fallo
  }
}

function mostrarAmigo(carta) {
  // Prevenir múltiples clicks rápidos
  if (carta.dataset.flipping === 'true') {
    return;
  }
  
  carta.dataset.flipping = 'true';
  
  const frontal = carta.querySelector('.frontal');
  const traseraExito = carta.querySelector('.trasera-exito');
  const traseraError = carta.querySelector('.trasera-error');
  const nombreCarta = carta.dataset.nombre;
  const esAcierto = verificarAmigoCarta(nombreCarta);

  // Si la carta ya está volteada, volver al frente
  if (frontal.style.transform === 'rotateY(-180deg)') {
    frontal.style.transform = 'rotateY(0deg)';
    traseraExito.style.transform = 'rotateY(180deg)';
    traseraError.style.transform = 'rotateY(180deg)';
    traseraExito.style.display = 'none';
    traseraError.style.display = 'none';
  } else {
    // Voltear la carta
    frontal.style.transform = 'rotateY(-180deg)';
    
    if (esAcierto) {
      // Mostrar carta de éxito
      traseraExito.style.display = 'block';
      traseraError.style.display = 'none';
      traseraExito.style.transform = 'rotateY(0deg)';
      mostrarMensajeAcierto();
    } else {
      // Mostrar carta de error
      traseraError.style.display = 'block';
      traseraExito.style.display = 'none';
      traseraError.style.transform = 'rotateY(0deg)';
      mostrarMensajeFallo();
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
    const traseraExito = carta.querySelector('.trasera-exito');
    const traseraError = carta.querySelector('.trasera-error');
    frontal.style.transform = 'rotateY(0deg)';
    traseraExito.style.transform = 'rotateY(180deg)';
    traseraError.style.transform = 'rotateY(180deg)';
    traseraExito.style.display = 'none';
    traseraError.style.display = 'none';
  });
}

window.addEventListener('load', () => {
  // Eliminar el amigo almacenado al cargar la página
  sessionStorage.removeItem('amigoAleatorio');
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
    // Añadir event listener optimizado para touch
    carta.addEventListener('touchend', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mostrarAmigo(this);
    }, { passive: false });
    
    // Mantener compatibilidad con mouse
    carta.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mostrarAmigo(this);
    });
  });
});
