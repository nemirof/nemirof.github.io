// Script de prueba para verificar autenticación
// Ejecuta esto en la consola del navegador en homegames.html

console.log('🔍 PRUEBA: Verificando autenticación de usuarios...');

// Lista de estudiantes del sistema
const classRoster = [
  { name: 'abiel', photo: 'abiel.jpg' },
  { name: 'adrian', photo: 'adrian.jpg' },
  { name: 'aitana', photo: 'aitana.png' },
  { name: 'aizan', photo: 'aizan.jpg' },
  { name: 'alan', photo: 'alan.jpg' },
  { name: 'alba', photo: 'alba.jpg' },
  { name: 'alejandro', photo: 'alejandro.jpg' },
  { name: 'alex', photo: 'alex.jpg' },
  { name: 'alexandra', photo: 'alexandra.png' },
  { name: 'alicia', photo: 'alicia.jpg' },
  { name: 'alisson', photo: 'alisson.png' },
  { name: 'alma', photo: 'alma.png' },
  { name: 'amalia', photo: 'amalia.png' },
  { name: 'anais', photo: 'anais.jpg' },
  { name: 'antonio', photo: 'antonio.png' },
  { name: 'arabia', photo: 'arabia.jpg' },
  { name: 'ariadna', photo: 'ariadna.png' },
  { name: 'ashley', photo: 'ashley.jpg' },
  { name: 'aslan', photo: 'aslan.png' },
  { name: 'benjamin', photo: 'benjamin.jpg' },
  { name: 'carlos', photo: 'carlos.jpg' },
  { name: 'carolina', photo: 'carolina.png' },
  { name: 'cathaleya', photo: 'cathaleya.jpg' },
  { name: 'chloe', photo: 'chloe.jpg' },
  { name: 'dani', photo: 'dani.jpg' },
  { name: 'daniel', photo: 'danielB.jpg' },
  { name: 'danna', photo: 'danna.jpg' },
  { name: 'david', photo: 'david.png' },
  { name: 'elisa', photo: 'elisa.jpg' },
  { name: 'eva', photo: 'eva.jpg' },
  { name: 'gabriel', photo: 'gabriel.png' },
  { name: 'guadalupe', photo: 'guadalupe.png' },
  { name: 'ian', photo: 'ian.png' },
  { name: 'nemiroff', photo: 'logo11.png' },
  { name: 'ines', photo: 'ines.png' },
  { name: 'isabella', photo: 'isabella.png' },
  { name: 'jaime', photo: 'jaime.png' },
  { name: 'jimena', photo: 'jimena.png' },
  { name: 'jon', photo: 'jon.jpg' },
  { name: 'julia', photo: 'julia.png' },
  { name: 'junior', photo: 'junior.png' },
  { name: 'kadidia', photo: 'kadidia.png' },
  { name: 'laura', photo: 'laura.jpg' },
  { name: 'leo', photo: 'leo.jpg' },
  { name: 'luca', photo: 'luca.jpg' },
  { name: 'luna', photo: 'luna.png' },
  { name: 'marco', photo: 'marco.png' },
  { name: 'marcos', photo: 'marcos.jpg' },
  { name: 'mariam', photo: 'mariam.png' },
  { name: 'mencia', photo: 'mencia.png' },
  { name: 'markel', photo: 'markel.png' },
  { name: 'raquel', photo: 'raquelB.jpg' },
  { name: 'violeta', photo: 'violeta2.png' },
  { name: 'sol', photo: 'sol.png' },
  { name: 'nahia', photo: 'nahia.jpg' },
  { name: 'luna', photo: 'luna.jpg' },
  { name: 'sara', photo: 'sara.png' },
  { name: 'wallner', photo: 'wallner.png' },
  { name: 'mateo', photo: 'mateo.png' }
];

// Función de prueba
function testAuthentication(testName) {
  const name = testName.trim().toLowerCase();
  console.log(`\n🔍 Probando con: "${testName}" (normalizado: "${name}")`);
  
  const student = classRoster.find(s => s.name.toLowerCase() === name);
  
  if (student) {
    console.log(`✅ ENCONTRADO: ${student.name} -> ${student.photo}`);
    
    // Verificar si la imagen existe (esto generará error 404 si no existe)
    const img = new Image();
    img.onload = () => console.log(`✅ Imagen existe: images/${student.photo}`);
    img.onerror = () => console.log(`❌ Imagen NO existe: images/${student.photo}`);
    img.src = `images/${student.photo}`;
    
  } else {
    console.log(`❌ NO ENCONTRADO en la lista`);
    
    // Buscar nombres similares
    const similarNames = classRoster.filter(s => 
      s.name.toLowerCase().includes(name) || name.includes(s.name.toLowerCase())
    );
    
    if (similarNames.length > 0) {
      console.log(`🔍 Nombres similares encontrados:`, similarNames.map(s => s.name));
    }
  }
}

// Pruebas
testAuthentication('sol');
testAuthentication('Sol');
testAuthentication('SOL');
testAuthentication('nahia');
testAuthentication('Nahia');
testAuthentication('NAHIA');

// Verificar lista completa
console.log('\n📋 Lista completa de estudiantes:');
classRoster.forEach((student, index) => {
  console.log(`${index + 1}. ${student.name} -> ${student.photo}`);
});

console.log('\n💡 Para usar: testAuthentication("nombre") en la consola');