// Script de depuración para verificar el ordenamiento de puntuaciones
// Ejecuta este código en la consola del navegador (F12) cuando estés en el juego

console.log('🔍 Debug: Verificando ordenamiento de puntuaciones...');

// 1. Verificar datos locales
const localData = JSON.parse(localStorage.getItem('nemiroff-games-backup') || '{}');
const livingThingsScores = localData.livingThingsScores || [];

console.log('📊 Puntuaciones locales encontradas:', livingThingsScores.length);
livingThingsScores.forEach((score, index) => {
  console.log(`${index + 1}. ${score.name}: ${score.score} puntos (${score.date || score.timestamp})`);
});

// 2. Verificar si están ordenados correctamente
if (livingThingsScores.length > 1) {
  let correctOrder = true;
  for (let i = 0; i < livingThingsScores.length - 1; i++) {
    if (livingThingsScores[i].score < livingThingsScores[i + 1].score) {
      correctOrder = false;
      console.error(`❌ Error de orden: ${livingThingsScores[i].name} (${livingThingsScores[i].score}) está antes que ${livingThingsScores[i + 1].name} (${livingThingsScores[i + 1].score})`);
    }
  }
  
  if (correctOrder) {
    console.log('✅ Las puntuaciones están ordenadas correctamente (mayor a menor)');
  } else {
    console.log('❌ Las puntuaciones NO están ordenadas correctamente');
    
    // Corregir orden
    const sortedScores = [...livingThingsScores].sort((a, b) => b.score - a.score);
    console.log('🔧 Orden corregido:');
    sortedScores.forEach((score, index) => {
      console.log(`${index + 1}. ${score.name}: ${score.score} puntos`);
    });
    
    // Guardar orden corregido
    localData.livingThingsScores = sortedScores;
    localStorage.setItem('nemiroff-games-backup', JSON.stringify(localData));
    console.log('✅ Orden corregido y guardado. Recarga la página.');
  }
}

// 3. Agregar puntuación de prueba si no hay datos
if (livingThingsScores.length === 0) {
  console.log('📝 No hay puntuaciones. Agregando datos de prueba...');
  const testScores = [
    { name: 'Alice', score: 1500, timestamp: new Date().toISOString() },
    { name: 'Bob', score: 1200, timestamp: new Date().toISOString() },
    { name: 'Charlie', score: 1800, timestamp: new Date().toISOString() },
    { name: 'Diana', score: 900, timestamp: new Date().toISOString() }
  ].sort((a, b) => b.score - a.score);
  
  localData.livingThingsScores = testScores;
  localStorage.setItem('nemiroff-games-backup', JSON.stringify(localData));
  console.log('✅ Datos de prueba agregados. Recarga la página.');
}