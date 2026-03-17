const { google } = require('googleapis');
const readline = require('readline');

// ⬇️ REEMPLAZA CON TUS CREDENCIALES DEL PASO 4
const CLIENT_ID = '475665246879-b53igeu8ph1gq5qem5hi7thkdvt6i8j1.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/spreadsheets'
];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🔐 GENERADOR DE REFRESH TOKEN - SINERGIA BACKEND          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📝 PASO 1: Copia y pega esta URL en tu navegador:\n');
console.log('\x1b[36m%s\x1b[0m', authUrl);
console.log('\n📝 PASO 2: Autoriza la aplicación con tu cuenta de Gmail');
console.log('📝 PASO 3: Serás redirigido a una página que no carga (es normal)');
console.log('📝 PASO 4: Copia TODA la URL de esa página y pégala aquí abajo\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Pega la URL completa aquí: ', async (url) => {
  try {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    
    if (!code) {
      console.error('\n❌ ERROR: No se encontró el código en la URL');
      console.error('Asegúrate de copiar la URL completa que empieza con: http://localhost:3000/oauth2callback?code=...\n');
      process.exit(1);
    }

    console.log('\n⏳ Obteniendo tokens...\n');
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ ¡TOKENS OBTENIDOS EXITOSAMENTE!                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    console.log('📋 COPIA ESTAS LÍNEAS A TU ARCHIVO .env:\n');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('─────────────────────────────────────────────────────────────\n');
    
    console.log('💾 Guarda el REFRESH TOKEN en un lugar seguro\n');
    console.log('⚠️  IMPORTANTE: El Refresh Token solo se muestra UNA VEZ\n');
    
  } catch (error) {
    console.error('\n❌ ERROR al obtener el token:', error.message);
    console.error('\nPosibles causas:');
    console.error('1. La URL copiada está incompleta');
    console.error('2. El código ya fue usado (debes volver a autorizar)');
    console.error('3. Las credenciales CLIENT_ID o CLIENT_SECRET son incorrectas\n');
  }
  
  rl.close();
});