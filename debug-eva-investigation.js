// Script específico para diagnosticar los datos de Eva en Firebase
// Ejecuta este código en la consola del navegador (F12) cuando estés en cualquier juego

console.log('🕵️ DIAGNÓSTICO: Investigando datos de Eva en Firebase...');

async function investigateEvaData() {
  if (!window.firebaseDB) {
    console.log('❌ Firebase no disponible');
    return;
  }
  
  console.log('\n🔍 Buscando todos los registros de Eva en lilo-stitchScores...');
  
  try {
    // Obtener TODOS los documentos sin límite ni ordenación
    const q = window.firebaseCollection(window.firebaseDB, 'lilo-stitchScores');
    const querySnapshot = await window.firebaseGetDocs(q);
    
    console.log(`📊 Total documentos en lilo-stitchScores: ${querySnapshot.docs.length}`);
    
    // Buscar todos los registros de Eva (case-insensitive)
    const evaRecords = [];
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.name && data.name.toLowerCase() === 'eva') {
        evaRecords.push({
          id: doc.id,
          data: data,
          score: data.score || 0,
          timestamp: data.timestamp || 'No timestamp'
        });
      }
    });
    
    console.log(`🎯 Registros de Eva encontrados: ${evaRecords.length}`);
    
    if (evaRecords.length === 0) {
      console.log('⚠️ No se encontraron registros de Eva');
      return;
    }
    
    // Ordenar por score (mayor a menor)
    evaRecords.sort((a, b) => b.score - a.score);
    
    console.log('\n📋 Detalles de todos los registros de Eva:');
    evaRecords.forEach((record, index) => {
      console.log(`\n${index + 1}. Document ID: ${record.id}`);
      console.log(`   Score: ${record.score}`);
      console.log(`   Name: "${record.data.name}"`);
      console.log(`   Time: ${record.data.time || 'No time'}`);
      console.log(`   Timestamp: ${record.timestamp}`);
      console.log(`   Full data:`, record.data);
    });
    
    console.log('\n🔄 Simulando lógica de deduplicación...');
    
    // Simular la misma lógica de deduplicación que usan ambos sistemas
    const uniqueScores = [];
    const seenUsers = new Set();
    
    // Primero ordenamos todos los datos por score (como hace Firebase)
    const allDocs = querySnapshot.docs.map(doc => doc.data());
    const sortedDocs = allDocs.sort((a, b) => {
      const scoreA = parseInt(a.score) || 0;
      const scoreB = parseInt(b.score) || 0;
      return scoreB - scoreA; // Higher scores first
    });
    
    console.log('\n📊 Todos los documentos ordenados por score:');
    sortedDocs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.name}: ${doc.score} puntos`);
    });
    
    // Aplicar deduplicación
    sortedDocs.forEach(score => {
      if (!seenUsers.has(score.name.toLowerCase())) {
        seenUsers.add(score.name.toLowerCase());
        uniqueScores.push(score);
        if (score.name.toLowerCase() === 'eva') {
          console.log(`✅ Eva seleccionada en deduplicación: ${score.score} puntos`);
        }
      } else if (score.name.toLowerCase() === 'eva') {
        console.log(`🚫 Eva ignorada en deduplicación: ${score.score} puntos (duplicado)`);
      }
    });
    
    console.log('\n🏆 Resultado final después de deduplicación:');
    const evaFinal = uniqueScores.find(s => s.name.toLowerCase() === 'eva');
    if (evaFinal) {
      console.log(`Eva debería mostrar: ${evaFinal.score} puntos`);
    } else {
      console.log('Eva no aparece en el resultado final');
    }
    
  } catch (error) {
    console.error('❌ Error durante la investigación:', error);
  }
}

// Función para comparar con localStorage
function checkEvaLocalStorage() {
  console.log('\n💾 Verificando localStorage...');
  
  const localScores = JSON.parse(localStorage.getItem('lilo-stitchScores') || '[]');
  console.log(`Local lilo-stitchScores: ${localScores.length} registros`);
  
  const evaLocal = localScores.filter(score => 
    score.name && score.name.toLowerCase() === 'eva'
  );
  
  if (evaLocal.length > 0) {
    console.log('Eva en localStorage:');
    evaLocal.forEach((record, index) => {
      console.log(`  ${index + 1}. Score: ${record.score}, Time: ${record.time}`);
    });
  } else {
    console.log('Eva no encontrada en localStorage');
  }
  
  // Verificar backup storage
  const backupData = JSON.parse(localStorage.getItem('nemiroff-games-backup') || '{}');
  const backupScores = backupData['lilo-stitchScores'] || [];
  
  console.log(`Backup lilo-stitchScores: ${backupScores.length} registros`);
  
  const evaBackup = backupScores.filter(score => 
    score.name && score.name.toLowerCase() === 'eva'
  );
  
  if (evaBackup.length > 0) {
    console.log('Eva en backup storage:');
    evaBackup.forEach((record, index) => {
      console.log(`  ${index + 1}. Score: ${record.score}, Time: ${record.time}`);
    });
  } else {
    console.log('Eva no encontrada en backup storage');
  }
}

// Hacer las funciones disponibles globalmente
window.investigateEvaData = investigateEvaData;
window.checkEvaLocalStorage = checkEvaLocalStorage;

console.log('\n💡 Para usar:');
console.log('  investigateEvaData()     // Investigar Firebase');
console.log('  checkEvaLocalStorage()   // Verificar localStorage');