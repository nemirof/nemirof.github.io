// Script para limpiar duplicados en Firebase
// Ejecuta este código en la consola del navegador (F12) cuando estés en cualquier juego

console.log('🧹 LIMPIEZA: Eliminando duplicados de Firebase...');

async function cleanDuplicatesInFirebase(collectionName) {
  console.log(`\n🔍 Limpiando duplicados en colección: ${collectionName}`);
  
  try {
    if (!window.firebaseDB) {
      console.log('❌ Firebase no disponible');
      return;
    }
    
    // Obtener todos los documentos
    const q = window.firebaseQuery(
      window.firebaseCollection(window.firebaseDB, collectionName),
      window.firebaseOrderBy('score', 'desc')
    );
    const querySnapshot = await window.firebaseGetDocs(q);
    
    console.log(`📊 Total documentos encontrados: ${querySnapshot.docs.length}`);
    
    // Agrupar por nombre (case-insensitive)
    const playerGroups = new Map();
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const playerName = data.name ? data.name.toLowerCase() : '';
      
      if (!playerGroups.has(playerName)) {
        playerGroups.set(playerName, []);
      }
      
      playerGroups.get(playerName).push({
        id: doc.id,
        data: data,
        score: data.score || 0
      });
    });
    
    // Encontrar jugadores con duplicados
    const duplicatedPlayers = [];
    playerGroups.forEach((docs, playerName) => {
      if (docs.length > 1) {
        duplicatedPlayers.push({ playerName, docs });
        console.log(`🔍 ${playerName}: ${docs.length} registros encontrados`);
        docs.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.score} puntos (ID: ${doc.id})`);
        });
      }
    });
    
    if (duplicatedPlayers.length === 0) {
      console.log('✅ No se encontraron duplicados');
      return;
    }
    
    console.log(`\n🎯 Se encontraron ${duplicatedPlayers.length} jugadores con duplicados`);
    
    // Para cada jugador con duplicados, mantener solo el mejor score
    for (const player of duplicatedPlayers) {
      const { playerName, docs } = player;
      
      // Ordenar por score (mayor primero)
      docs.sort((a, b) => b.score - a.score);
      
      const bestDoc = docs[0];
      const docsToDelete = docs.slice(1);
      
      console.log(`\n🔄 Procesando ${playerName}:`);
      console.log(`   ✅ Manteniendo: ${bestDoc.score} puntos (ID: ${bestDoc.id})`);
      
      if (docsToDelete.length > 0) {
        console.log(`   🗑️ Eliminando ${docsToDelete.length} registros inferiores:`);
        
        for (const docToDelete of docsToDelete) {
          console.log(`      - Eliminando: ${docToDelete.score} puntos (ID: ${docToDelete.id})`);
          
          try {
            // Aquí necesitaríamos la función deleteDoc, pero no está implementada
            // Por ahora solo reportamos lo que se eliminaría
            console.log(`      ⚠️ SIMULACIÓN: Se eliminaría documento ${docToDelete.id}`);
          } catch (error) {
            console.error(`      ❌ Error eliminando ${docToDelete.id}:`, error);
          }
        }
      }
    }
    
    console.log('\n✅ Limpieza completada (simulación)');
    console.log('💡 Para eliminar realmente, necesitas implementar window.firebaseDeleteDoc');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Función para limpiar todas las colecciones
async function cleanAllGameCollections() {
  const collections = ['livingThingsScores', 'kpop-demon-huntersScores', 'lilo-stitchScores'];
  
  for (const collection of collections) {
    await cleanDuplicatesInFirebase(collection);
  }
}

// Hacer las funciones disponibles globalmente
window.cleanDuplicatesInFirebase = cleanDuplicatesInFirebase;
window.cleanAllGameCollections = cleanAllGameCollections;

console.log('💡 Para usar:');
console.log('  cleanDuplicatesInFirebase("lilo-stitchScores")  // Limpiar solo Lilo & Stitch');
console.log('  cleanAllGameCollections()                       // Limpiar todos los juegos');