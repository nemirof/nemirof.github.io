// Script para diagnosticar la discrepancia de puntuaciones
// Ejecuta este código en la consola del navegador (F12)

console.log('🔍 DIAGNOSTICO: Comparando fuentes de datos para Lilo & Stitch...');

async function compareLiloStitchSources() {
  console.log('\n=== COMPARANDO FUENTES DE DATOS PARA LILO & STITCH ===');
  
  // 1. Verificar datos de Firebase (lo que usa View All Leaderboards)
  console.log('\n🔥 1. FIREBASE DATA (usado por View All Leaderboards):');
  try {
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc')
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      
      console.log(`   📊 Total registros en Firebase: ${querySnapshot.docs.length}`);
      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${data.name}: ${data.score} puntos (ID: ${doc.id})`);
        if (data.name && data.name.toLowerCase() === 'eva') {
          console.log(`      🎯 EVA encontrada en Firebase: ${data.score} puntos`);
        }
      });
    } else {
      console.log('   ❌ Firebase no disponible');
    }
  } catch (error) {
    console.error('   ❌ Error al leer Firebase:', error);
  }
  
  // 2. Verificar datos locales (posible fallback)
  console.log('\n💾 2. LOCAL STORAGE DATA:');
  
  // Verificar diferentes claves posibles
  const keys = ['lilo-stitchScores', 'liloStitchScores', 'nemiroff-games-backup'];
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`   📋 Clave "${key}":`);
        
        if (Array.isArray(parsed)) {
          console.log(`      Array con ${parsed.length} elementos:`);
          parsed.forEach((item, index) => {
            console.log(`      ${index + 1}. ${item.name}: ${item.score} puntos`);
            if (item.name && item.name.toLowerCase() === 'eva') {
              console.log(`         🎯 EVA encontrada en localStorage: ${item.score} puntos`);
            }
          });
        } else if (typeof parsed === 'object') {
          console.log(`      Objeto con claves:`, Object.keys(parsed));
          if (parsed['lilo-stitchScores']) {
            console.log(`      Subarray lilo-stitchScores: ${parsed['lilo-stitchScores'].length} elementos`);
            parsed['lilo-stitchScores'].forEach((item, index) => {
              console.log(`      ${index + 1}. ${item.name}: ${item.score} puntos`);
              if (item.name && item.name.toLowerCase() === 'eva') {
                console.log(`         🎯 EVA encontrada en backup: ${item.score} puntos`);
              }
            });
          }
        }
      } catch (e) {
        console.log(`   ❌ Error al parsear "${key}":`, e.message);
      }
    } else {
      console.log(`   📭 Clave "${key}": no existe`);
    }
  });
  
  // 3. Simular lo que hace game-selection.js (View All Leaderboards)
  console.log('\n🎮 3. SIMULANDO GAME-SELECTION.JS (View All Leaderboards):');
  try {
    // Esta es la lógica de game-selection.js
    let collectionName = 'lilo-stitchScores'; // Mapeo correcto
    console.log(`   📋 Usando colección: ${collectionName}`);
    
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, collectionName),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      const scores = querySnapshot.docs.map(doc => doc.data());
      
      console.log(`   📊 View All Leaderboards vería ${scores.length} puntuaciones:`);
      scores.forEach((score, index) => {
        console.log(`   ${index + 1}. ${score.name}: ${score.score} puntos`);
        if (score.name && score.name.toLowerCase() === 'eva') {
          console.log(`      🎯 EVA en View All Leaderboards: ${score.score} puntos`);
        }
      });
    }
  } catch (error) {
    console.error('   ❌ Error simulando game-selection:', error);
  }
  
  // 4. Simular lo que hace lilo-stitch.js (leaderboard individual)
  console.log('\n🌺 4. SIMULANDO LILO-STITCH.JS (Leaderboard individual):');
  try {
    // Esta es la lógica de lilo-stitch.js showLeaderboard()
    if (window.firebaseDB) {
      const q = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores'),
        window.firebaseOrderBy('score', 'desc'),
        window.firebaseLimit(20)
      );
      const querySnapshot = await window.firebaseGetDocs(q);
      const scores = querySnapshot.docs.map(doc => doc.data());
      
      console.log(`   📊 Leaderboard individual vería ${scores.length} puntuaciones:`);
      scores.forEach((score, index) => {
        console.log(`   ${index + 1}. ${score.name}: ${score.score} puntos`);
        if (score.name && score.name.toLowerCase() === 'eva') {
          console.log(`      🎯 EVA en leaderboard individual: ${score.score} puntos`);
        }
      });
    }
  } catch (error) {
    console.error('   ❌ Error simulando lilo-stitch:', error);
  }
  
  console.log('\n=== FIN DEL DIAGNÓSTICO ===');
}

// Ejecutar el diagnóstico
compareLiloStitchSources();