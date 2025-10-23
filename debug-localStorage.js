// Script para verificar los datos de localStorage
// Ejecuta esto en la consola del navegador (F12) en cualquier juego

console.log('🔍 DEBUG: Verificando datos de localStorage...');

// Verificar todas las claves de localStorage
console.log('📋 Todas las claves en localStorage:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`  - ${key}`);
}

// Verificar claves específicas de los juegos
const gameKeys = [
  'living-thingsScores',
  'kpop-demon-huntersScores', 
  'lilo-stitchScores',
  'nemiroff-games-backup'
];

gameKeys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log(`📊 ${key}:`, parsed);
      
      if (Array.isArray(parsed)) {
        console.log(`   └─ Array con ${parsed.length} elementos`);
      } else if (typeof parsed === 'object') {
        console.log(`   └─ Objeto con claves:`, Object.keys(parsed));
        Object.keys(parsed).forEach(subKey => {
          if (Array.isArray(parsed[subKey])) {
            console.log(`      └─ ${subKey}: Array con ${parsed[subKey].length} elementos`);
          }
        });
      }
    } catch (e) {
      console.log(`📊 ${key}: (no es JSON válido)`, data);
    }
  } else {
    console.log(`📊 ${key}: (no existe)`);
  }
});

// Función para agregar datos de prueba si no existen
function addTestData() {
  const testData = {
    livingThingsScores: [
      { name: 'TestUser1', score: 1500, time: 120, moves: 25, photo: 'logo11.png', timestamp: new Date().toISOString() },
      { name: 'TestUser2', score: 1200, time: 180, moves: 30, photo: 'logo11.png', timestamp: new Date().toISOString() },
      { name: 'TestUser3', score: 1800, time: 90, moves: 20, photo: 'logo11.png', timestamp: new Date().toISOString() }
    ],
    kpopDemonHuntersScores: [
      { name: 'KpopFan1', score: 2000, time: 100, moves: 18, photo: 'logo11.png', timestamp: new Date().toISOString() },
      { name: 'KpopFan2', score: 1600, time: 150, moves: 28, photo: 'logo11.png', timestamp: new Date().toISOString() }
    ],
    liloStitchScores: [
      { name: 'OhanaUser', score: 1700, time: 110, moves: 22, photo: 'logo11.png', timestamp: new Date().toISOString() }
    ]
  };
  
  localStorage.setItem('nemiroff-games-backup', JSON.stringify(testData));
  console.log('✅ Datos de prueba agregados. Recarga la página y prueba "View All Leaderboards".');
}

console.log('💡 Si no hay datos, ejecuta: addTestData()');