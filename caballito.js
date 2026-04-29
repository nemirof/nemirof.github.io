// Caballito de Mar - Juego Educativo para niños de 4-5 años
// Usa Web Speech API para leer las preguntas en voz alta

// Estado del juego
let estadoJuego = {
  preguntaActual: 0,
  aciertos: 0,
  totalPreguntas: 5,
  sonidoActivo: true,
  juegoTerminado: false,
  vozCargada: false
};

// Preguntas sobre caballitos de mar
const preguntas = [
  {
    texto: "¿De qué se alimentan los caballitos de mar?",
    opciones: [
      { imagen: "🦐", texto: "Animalitos pequeños", correcta: true },
      { imagen: "🥬", texto: "Algas", correcta: false },
      { imagen: "🐚", texto: "Almejas", correcta: false },
      { imagen: "🍎", texto: "Frutas", correcta: false }
    ],
    explicacion: "¡Muy bien! Los caballitos de mar comen camarones pequeñitos y otros animalitos diminutos."
  },
  {
    texto: "¿Quién lleva los bebés en su bolsita?",
    opciones: [
      { imagen: "👨", texto: "El papá", correcta: true },
      { imagen: "👩", texto: "La mamá", correcta: false },
      { imagen: "👶", texto: "El bebé", correcta: false },
      { imagen: "👴", texto: "El abuelo", correcta: false }
    ],
    explicacion: "¡Increíble! En los caballitos de mar es el papá quien lleva los bebés en su bolsita especial."
  },
  {
    texto: "¿Qué tipo de animal es el caballito de mar?",
    opciones: [
      { imagen: "🐟", texto: "Un pez", correcta: true },
      { imagen: "🐴", texto: "Un caballo", correcta: false },
      { imagen: "🐍", texto: "Una serpiente", correcta: false },
      { imagen: "🦀", texto: "Un cangrejo", correcta: false }
    ],
    explicacion: "¡Correcto! Aunque se llama caballito, ¡es un pez de verdad que vive en el mar!"
  },
  {
    texto: "¿Cómo nadan los caballitos de mar?",
    opciones: [
      { imagen: "🐢", texto: "Muy despacito", correcta: true },
      { imagen: "🚀", texto: "Muy rápido", correcta: false },
      { imagen: "🦘", texto: "Dando saltos", correcta: false },
      { imagen: "🚶", texto: "Caminando", correcta: false }
    ],
    explicacion: "¡Así es! Los caballitos de mar nadan muy despacito, son los peces más lentos del océano."
  },
  {
    texto: "¿Cómo respiran los caballitos de mar?",
    opciones: [
      { imagen: "🫁", texto: "Con branquias", correcta: true },
      { imagen: "👃", texto: "Con la nariz", correcta: false },
      { imagen: "🌬️", texto: "Con la boca", correcta: false },
      { imagen: "🐚", texto: "Con su caparazón", correcta: false }
    ],
    explicacion: "¡Muy bien! Los caballitos de mar respiran con branquias, como todos los peces."
  }
];

// Inicializar el juego
document.addEventListener('DOMContentLoaded', function() {
  inicializarJuego();
});

function inicializarJuego() {
  // Cargar estado del mute
  const mutedGuardado = localStorage.getItem('muteState') === 'true';
  estadoJuego.sonidoActivo = !mutedGuardado;
  actualizarIconoMute();
  
  // Preparar la síntesis de voz
  prepararVoz();
  
  // Mostrar pantalla de inicio
  mostrarPantallaInicio();
}

// Preparar la síntesis de voz
function prepararVoz() {
  if ('speechSynthesis' in window) {
    // Cargar las voces disponibles
    let voces = speechSynthesis.getVoices();
    
    if (voces.length === 0) {
      speechSynthesis.onvoiceschanged = function() {
        voces = speechSynthesis.getVoices();
        estadoJuego.vozCargada = true;
      };
    } else {
      estadoJuego.vozCargada = true;
    }
  } else {
    console.log('La síntesis de voz no está soportada en este navegador');
  }
}

// Obtener voz en español
function obtenerVozEspanol() {
  const voces = speechSynthesis.getVoices();
  
  // Buscar voz en español (preferir voces femeninas y locales)
  const vocesEspanol = voces.filter(voz => 
    voz.lang.startsWith('es') || voz.lang.includes('ES')
  );
  
  // Preferir voces femeninas
  const vozFemenina = vocesEspanol.find(voz => 
    voz.name.toLowerCase().includes('female') || 
    voz.name.toLowerCase().includes('sabina') ||
    voz.name.toLowerCase().includes('monica') ||
    voz.name.toLowerCase().includes('helena') ||
    voz.name.toLowerCase().includes('laura')
  );
  
  return vozFemenina || vocesEspanol[0] || voces[0];
}

// Leer texto en voz alta
function leerTexto(texto, callback = null) {
  if (!estadoJuego.sonidoActivo) {
    if (callback) callback();
    return;
  }
  
  if ('speechSynthesis' in window) {
    // Cancelar cualquier lectura anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = obtenerVozEspanol();
    utterance.rate = 0.85; // Un poco más lento para niños
    utterance.pitch = 1.1; // Un poco más agudo, más amigable
    utterance.volume = 1;
    utterance.lang = 'es-ES';
    
    // Mostrar animación del caballito hablando
    const mascota = document.querySelector('.mascota');
    if (mascota) {
      mascota.classList.add('hablar');
    }
    
    utterance.onend = function() {
      if (mascota) {
        mascota.classList.remove('hablar');
      }
      if (callback) callback();
    };
    
    utterance.onerror = function() {
      if (mascota) {
        mascota.classList.remove('hablar');
      }
      if (callback) callback();
    };
    
    speechSynthesis.speak(utterance);
  } else if (callback) {
    callback();
  }
}

// SVG del caballito de mar
const svgCaballito = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="55" rx="18" ry="30" fill="#FF9F43"/>
    <circle cx="50" cy="22" r="15" fill="#FF9F43"/>
    <ellipse cx="65" cy="25" rx="12" ry="5" fill="#FF9F43"/>
    <circle cx="75" cy="25" r="3" fill="#FF6B6B"/>
    <circle cx="52" cy="18" r="5" fill="white"/>
    <circle cx="53" cy="17" r="3" fill="#2C3E50"/>
    <circle cx="54" cy="16" r="1" fill="white"/>
    <path d="M 32 20 Q 25 35 32 50 Q 38 45 35 35 Q 42 40 38 30 Q 45 35 40 25 Q 47 28 45 20 Q 42 25 38 18 Q 35 22 32 20" fill="#E74C3C"/>
    <ellipse cx="68" cy="50" rx="8" ry="4" fill="#FFBE76" transform="rotate(30, 68, 50)"/>
    <path d="M 50 85 Q 40 95 30 90 Q 20 85 25 75 Q 30 65 40 70 Q 45 75 42 80" fill="#FF9F43" stroke="#E67E22" stroke-width="2"/>
    <ellipse cx="55" cy="60" rx="10" ry="20" fill="#FFE4B5"/>
    <path d="M 48 45 Q 55 47 60 45" fill="none" stroke="#FFDAB9" stroke-width="1"/>
    <path d="M 47 52 Q 55 54 61 52" fill="none" stroke="#FFDAB9" stroke-width="1"/>
    <path d="M 46 59 Q 55 61 62 59" fill="none" stroke="#FFDAB9" stroke-width="1"/>
    <path d="M 47 66 Q 55 68 61 66" fill="none" stroke="#FFDAB9" stroke-width="1"/>
    <circle cx="58" cy="28" r="4" fill="#FFB8B8" opacity="0.6"/>
    <path d="M 62 30 Q 65 33 68 30" fill="none" stroke="#E74C3C" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

// Mostrar pantalla de inicio
function mostrarPantallaInicio() {
  const container = document.querySelector('.game-container');
  container.innerHTML = `
    <div class="mascota-container">
      <div class="mascota" onclick="leerTexto('¡Hola! Soy un caballito de mar. ¡Vamos a aprender juntos!')">${svgCaballito}</div>
    </div>
    <div class="pantalla-inicio">
      <h2>🐠 ¡Aprende sobre los Caballitos de Mar! 🐚</h2>
      <p>¡Hola amiguito! Voy a hacerte unas preguntas divertidas sobre los caballitos de mar. ¡Escucha bien y toca la respuesta correcta!</p>
      <button class="btn-empezar" onclick="empezarJuego()">
        ¡Empezar! 🎮
      </button>
    </div>
  `;
  
  // Decir bienvenida después de un momento
  setTimeout(() => {
    leerTexto('¡Hola amiguito! Soy un caballito de mar. ¿Quieres aprender cosas divertidas sobre mí? ¡Pulsa el botón para empezar!');
  }, 500);
}

// Empezar el juego
function empezarJuego() {
  estadoJuego.preguntaActual = 0;
  estadoJuego.aciertos = 0;
  estadoJuego.juegoTerminado = false;
  
  // Mezclar opciones de cada pregunta
  preguntas.forEach(pregunta => {
    pregunta.opciones = mezclarArray([...pregunta.opciones]);
  });
  
  mostrarPregunta();
}

// Mezclar array (Fisher-Yates)
function mezclarArray(array) {
  const nuevoArray = [...array];
  for (let i = nuevoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
  }
  return nuevoArray;
}

// Mostrar pregunta actual
function mostrarPregunta() {
  const pregunta = preguntas[estadoJuego.preguntaActual];
  const container = document.querySelector('.game-container');
  
  container.innerHTML = `
    <div class="mascota-container">
      <div class="mascota" onclick="repetirPregunta()">${svgCaballito}</div>
    </div>
    
    <div class="pregunta-container">
      <div class="pregunta-numero">Pregunta ${estadoJuego.preguntaActual + 1} de ${estadoJuego.totalPreguntas}</div>
      <div class="pregunta-texto">${pregunta.texto}</div>
    </div>
    
    <div class="opciones-container">
      ${pregunta.opciones.map((opcion, index) => `
        <div class="opcion" onclick="seleccionarRespuesta(${index})" data-index="${index}">
          <div class="opcion-imagen">${opcion.imagen}</div>
          <div class="opcion-texto">${opcion.texto}</div>
        </div>
      `).join('')}
    </div>
    
    <div id="mensaje-resultado" class="mensaje-resultado"></div>
    
    <div class="controles oculto" id="controles-siguiente">
      <button class="btn-control repetir" onclick="repetirPregunta()">🔊 Repetir</button>
      <button class="btn-control siguiente" onclick="siguientePregunta()">Siguiente ➡️</button>
    </div>
  `;
  
  // Leer la pregunta en voz alta
  setTimeout(() => {
    leerTexto(pregunta.texto);
  }, 300);
}

// Repetir la pregunta actual
function repetirPregunta() {
  const pregunta = preguntas[estadoJuego.preguntaActual];
  leerTexto(pregunta.texto);
}

// Seleccionar respuesta
function seleccionarRespuesta(index) {
  const pregunta = preguntas[estadoJuego.preguntaActual];
  const opcionSeleccionada = pregunta.opciones[index];
  const opciones = document.querySelectorAll('.opcion');
  const mensajeDiv = document.getElementById('mensaje-resultado');
  const controlesDiv = document.getElementById('controles-siguiente');
  
  // Deshabilitar todas las opciones
  opciones.forEach(opcion => {
    opcion.classList.add('deshabilitada');
  });
  
  if (opcionSeleccionada.correcta) {
    // ¡Respuesta correcta!
    estadoJuego.aciertos++;
    opciones[index].classList.add('correcta');
    
    mensajeDiv.className = 'mensaje-resultado correcto';
    mensajeDiv.innerHTML = '🎉 ¡MUY BIEN! 🎉';
    
    // Reproducir sonido de éxito
    reproducirSonidoExito();
    
    // Lanzar confeti
    crearConfeti();
    
    // Leer la explicación
    setTimeout(() => {
      leerTexto(pregunta.explicacion);
    }, 1500);
    
  } else {
    // Respuesta incorrecta
    opciones[index].classList.add('incorrecta');
    
    // Mostrar la respuesta correcta
    const indexCorrecta = pregunta.opciones.findIndex(op => op.correcta);
    opciones[indexCorrecta].classList.add('correcta');
    
    mensajeDiv.className = 'mensaje-resultado incorrecto';
    mensajeDiv.innerHTML = '¡Ups! Inténtalo otra vez 💪';
    
    // Leer mensaje de ánimo
    setTimeout(() => {
      leerTexto('¡No pasa nada! La respuesta correcta era ' + pregunta.opciones[indexCorrecta].texto + '. ¡Sigue intentándolo!');
    }, 500);
  }
  
  // Mostrar botón de siguiente
  controlesDiv.classList.remove('oculto');
}

// Siguiente pregunta
function siguientePregunta() {
  estadoJuego.preguntaActual++;
  
  if (estadoJuego.preguntaActual >= estadoJuego.totalPreguntas) {
    // Juego terminado
    mostrarResultadoFinal();
  } else {
    mostrarPregunta();
  }
}

// Mostrar resultado final
function mostrarResultadoFinal() {
  estadoJuego.juegoTerminado = true;
  const container = document.querySelector('.game-container');
  
  // Calcular estrellas
  let estrellas = '';
  let mensaje = '';
  
  if (estadoJuego.aciertos === estadoJuego.totalPreguntas) {
    estrellas = '⭐⭐⭐';
    mensaje = '¡INCREÍBLE! ¡Eres un experto en caballitos de mar!';
  } else if (estadoJuego.aciertos >= estadoJuego.totalPreguntas * 0.6) {
    estrellas = '⭐⭐';
    mensaje = '¡MUY BIEN! ¡Has aprendido mucho sobre caballitos!';
  } else {
    estrellas = '⭐';
    mensaje = '¡BIEN HECHO! ¡Sigue practicando para aprender más!';
  }
  
  container.innerHTML = `
    <div class="mascota-container">
      <div class="mascota" onclick="leerTexto('${mensaje}')">${svgCaballito}</div>
    </div>
    
    <div class="pantalla-final visible">
      <h2>🎊 ¡Juego Terminado! 🎊</h2>
      <div class="puntuacion">${estadoJuego.aciertos} / ${estadoJuego.totalPreguntas}</div>
      <div class="estrellas">${estrellas}</div>
      <p>${mensaje}</p>
      
      <div class="controles" style="margin-top: 1.5rem;">
        <button class="btn-control" onclick="empezarJuego()">🔄 Jugar otra vez</button>
        <button class="btn-control" onclick="volverAlInicio()">🏠 Inicio</button>
      </div>
    </div>
  `;
  
  // Lanzar confeti si acertó todo
  if (estadoJuego.aciertos === estadoJuego.totalPreguntas) {
    crearConfeti();
    crearConfeti();
  }
  
  // Leer el resultado
  setTimeout(() => {
    leerTexto(`¡Has acertado ${estadoJuego.aciertos} de ${estadoJuego.totalPreguntas} preguntas! ${mensaje}`);
  }, 500);
}

// Volver al inicio del juego
function volverAlInicio() {
  mostrarPantallaInicio();
}

// Volver al centro de juegos
function volverAlCentro() {
  window.location.href = 'homegames.html';
}

// Reiniciar el juego completamente
function reiniciarJuego() {
  // Cancelar cualquier voz en curso
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
  // Volver a la pantalla de inicio
  mostrarPantallaInicio();
}

// Reproducir sonido de éxito
function reproducirSonidoExito() {
  if (!estadoJuego.sonidoActivo) return;
  
  const audio = document.getElementById('audio-exito');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Error reproduciendo audio:', e));
  }
}

// Crear efecto de confeti
function crearConfeti() {
  const colores = ['var(--coral)', 'var(--pink-coral)', 'var(--seaweed)', 'var(--ocean-blue)', 'var(--purple-sea)', 'var(--sand)'];
  const velocidades = ['rapido', 'lento', 'muy-lento', ''];
  
  // Crear 50 piezas de confeti
  for (let i = 0; i < 50; i++) {
    const confeti = document.createElement('div');
    confeti.className = 'confeti';
    
    // Posición aleatoria en el ancho de la pantalla
    confeti.style.left = Math.random() * window.innerWidth + 'px';
    
    // Color aleatorio
    confeti.style.background = colores[Math.floor(Math.random() * colores.length)];
    
    // Velocidad aleatoria
    const velocidadAleatoria = velocidades[Math.floor(Math.random() * velocidades.length)];
    if (velocidadAleatoria) {
      confeti.classList.add(velocidadAleatoria);
    }
    
    // Delay aleatorio
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

// Toggle mute
function toggleMute() {
  estadoJuego.sonidoActivo = !estadoJuego.sonidoActivo;
  localStorage.setItem('muteState', !estadoJuego.sonidoActivo);
  actualizarIconoMute();
  
  // Cancelar cualquier voz si se silencia
  if (!estadoJuego.sonidoActivo && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// Actualizar icono de mute
function actualizarIconoMute() {
  const icono = document.getElementById('sound-icon');
  if (icono) {
    icono.textContent = estadoJuego.sonidoActivo ? '🔊' : '🔇';
  }
}

// Event listener para cuando la página se cierra
window.addEventListener('beforeunload', function() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
});
