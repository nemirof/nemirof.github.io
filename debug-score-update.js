// Script de debugging para verificar las actualizaciones de puntuación
// Ejecuta este código en la consola del navegador (F12) en Lilo & Stitch

console.log('🔍 DEBUG: Verificando sistema de actualizaciones de puntuación...');

// Verificar si las funciones Firebase están disponibles
console.log('📋 Funciones Firebase disponibles:');
console.log('  - firebaseDB:', !!window.firebaseDB);
console.log('  - firebaseUpdateDoc:', !!window.firebaseUpdateDoc);
console.log('  - firebaseDoc:', !!window.firebaseDoc);
console.log('  - firebaseGetDocs:', !!window.firebaseGetDocs);

// Función para testear la lógica de actualización
async function testScoreUpdate(playerName, newScore) {
  console.log(`🧪 TESTING: Score update for ${playerName} with ${newScore} points`);
  
  try {
    // Simular la lógica de saveScore
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc')
      );
      
      console.log('🔍 Querying Firebase for existing scores...');
      const querySnapshot = await window.firebaseGetDocs(q);
      
      let existingDocId = null;
      let existingScore = null;
      let shouldUpdate = false;
      
      console.log(`📊 Found ${querySnapshot.docs.length} total scores`);
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${data.name}: ${data.score} points`);
        
        if (data.name && data.name.toLowerCase() === playerName.toLowerCase()) {
          existingDocId = doc.id;
          existingScore = data.score || 0;
          shouldUpdate = newScore > existingScore;
          console.log(`🎯 Found existing score for ${playerName}:`);
          console.log(`    Current: ${existingScore}, New: ${newScore}, Should update: ${shouldUpdate}`);
        }
      });
      
      if (!existingDocId) {
        console.log(`✨ ${playerName} is a new player - would ADD new score`);
      } else if (shouldUpdate) {
        console.log(`🔄 ${playerName} improved - would UPDATE from ${existingScore} to ${newScore}`);
      } else {
        console.log(`⚠️ ${playerName} did not improve - would NOT update (${newScore} <= ${existingScore})`);
      }
      
    } else {
      console.log('❌ Firebase not available');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Función helper para testear
console.log('💡 Para testear, ejecuta:');
console.log('  testScoreUpdate("Eva", 1800)  // Testear si Eva mejoraría con 1800 puntos');

// Hacer testScoreUpdate disponible globalmente
window.testScoreUpdate = testScoreUpdate;