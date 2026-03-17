const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { 
    success: false, 
    message: 'Demasiadas solicitudes. Por favor intente más tarde.' 
  }
});

// CORS - Simplificado para debugging
app.use(cors({
  origin: '*',  // Permitir todos los orígenes temporalmente
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use('/api/contact', limiter);

// Configuración OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Función para sanitización
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validación de email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validación de teléfono Ecuador
function isValidPhone(phone) {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
}

// Enviar email
async function enviarEmail(data) {
  try {
    console.log('📧 Iniciando envío de emails...');
    
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    // Email para el equipo de Sinergia
    const mailOptionsTeam = {
      from: `Sinergia Security <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Nueva Solicitud: ${data.tipoSolicitud.toUpperCase()} - ${data.servicio}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1d23 0%, #2c3e50 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f5f7fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; }
            .label { font-weight: bold; color: #487FC0; margin-bottom: 5px; }
            .value { color: #333; }
            .urgent { background: #c53030; color: white; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Nueva Solicitud</h1>
              <p>Sinergia Security Solutions</p>
            </div>
            <div class="content">
              ${data.camposAdicionales?.urgencia === 'urgente' ? '<div class="urgent">⚠️ SOLICITUD URGENTE</div>' : ''}
              
              <div class="info-row">
                <div class="label">Tipo de Solicitud:</div>
                <div class="value">${data.tipoSolicitud.toUpperCase()}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Servicio:</div>
                <div class="value">${data.servicio}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Fecha y Hora:</div>
                <div class="value">${data.fecha} - ${data.hora}</div>
              </div>
              
              <h3 style="color: #1a1d23; margin-top: 30px;">Datos del Cliente</h3>
              
              <div class="info-row">
                <div class="label">Nombre:</div>
                <div class="value">${data.nombreCompleto}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              
              <div class="info-row">
                <div class="label">Teléfono:</div>
                <div class="value"><a href="tel:${data.telefono}">${data.telefono}</a></div>
              </div>
              
              ${data.empresa ? `
              <div class="info-row">
                <div class="label">Empresa:</div>
                <div class="value">${data.empresa}</div>
              </div>
              ` : ''}
              
              ${data.cargo ? `
              <div class="info-row">
                <div class="label">Cargo:</div>
                <div class="value">${data.cargo}</div>
              </div>
              ` : ''}
              
              <h3 style="color: #1a1d23; margin-top: 30px;">Detalles de la Solicitud</h3>
              
              <div class="info-row">
                <div class="label">Asunto:</div>
                <div class="value">${data.asunto}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Mensaje:</div>
                <div class="value">${data.mensaje}</div>
              </div>
              
              ${data.camposAdicionales?.fechaPreferida ? `
              <div class="info-row">
                <div class="label">Fecha Preferida de Contacto:</div>
                <div class="value">${data.camposAdicionales.fechaPreferida}</div>
              </div>
              ` : ''}
              
              ${data.camposAdicionales?.horaPreferida ? `
              <div class="info-row">
                <div class="label">Hora Preferida:</div>
                <div class="value">${data.camposAdicionales.horaPreferida}</div>
              </div>
              ` : ''}
              
              <div class="info-row">
                <div class="label">Nivel de Urgencia:</div>
                <div class="value">${data.camposAdicionales?.urgencia || 'Media'}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Origen:</div>
                <div class="value" style="font-size: 11px; word-break: break-all;">${data.origen}</div>
              </div>
            </div>
            <div class="footer">
              <p>Sinergia Security Solutions © ${new Date().getFullYear()}</p>
              <p>Este email fue generado automáticamente desde el formulario web</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email de confirmación para el cliente
    const mailOptionsClient = {
      from: `Sinergia Security <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: 'Confirmación de Solicitud - Sinergia Security',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1d23 0%, #2c3e50 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f5f7fa; padding: 40px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E5C643; }
            .cta-button { display: inline-block; background: #487FC0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Solicitud Recibida</h1>
              <p>Gracias por contactar a Sinergia Security</p>
            </div>
            <div class="content">
              <p>Estimado/a <strong>${data.nombreCompleto}</strong>,</p>
              
              <p>Hemos recibido su solicitud de <strong>${data.tipoSolicitud}</strong> para el servicio de <strong>${data.servicio}</strong>.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #1a1d23;">📋 Resumen de su Solicitud</h3>
                <p><strong>Asunto:</strong> ${data.asunto}</p>
                <p><strong>Fecha:</strong> ${data.fecha}</p>
                <p><strong>Urgencia:</strong> ${data.camposAdicionales?.urgencia || 'Media'}</p>
              </div>
              
              <p><strong>¿Qué sigue?</strong></p>
              <ul>
                <li>Nuestro equipo revisará su solicitud en las próximas 24 horas</li>
                <li>Nos pondremos en contacto con usted vía email o teléfono</li>
                <li>Si su caso es urgente, puede llamarnos directamente</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="tel:+593999999999" class="cta-button">📞 Llamar Ahora: +593 99 999 9999</a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Nota:</strong> Este es un email automático. Si necesita asistencia inmediata, 
                por favor contáctenos directamente a nuestros números de teléfono.
              </p>
            </div>
            <div class="footer">
              <p><strong>Sinergia Security Solutions</strong></p>
              <p>📞 +593 99 999 9999 | 📧 ${process.env.GMAIL_USER}</p>
              <p>Guayaquil, Ecuador</p>
              <p style="margin-top: 15px;">© ${new Date().getFullYear()} Todos los derechos reservados</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Enviar ambos emails
    console.log('📤 Enviando email al equipo...');
    await transporter.sendMail(mailOptionsTeam);
    console.log('✅ Email al equipo enviado');

    console.log('📤 Enviando email de confirmación al cliente...');
    await transporter.sendMail(mailOptionsClient);
    console.log('✅ Email al cliente enviado');

    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}

// Guardar en Google Sheets
async function guardarEnGoogleSheets(data) {
  try {
    console.log('📊 Guardando en Google Sheets...');
    console.log('Spreadsheet ID:', SPREADSHEET_ID);
    
    const fecha = new Date();
    const row = [
      fecha.toISOString(),
      data.fecha,
      data.hora,
      data.tipoSolicitud,
      data.servicio,
      data.nombreCompleto,
      data.email,
      data.telefono,
      data.empresa || '',
      data.cargo || '',
      data.asunto,
      data.mensaje,
      data.camposAdicionales?.fechaPreferida || '',
      data.camposAdicionales?.horaPreferida || '',
      data.camposAdicionales?.urgencia || 'media',
      data.origen,
      'Pendiente',
      ''
    ];

    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: 'Solicitudes!A:R',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row]
      }
    };

    const response = await sheets.spreadsheets.values.append(request);
    console.log('✅ Datos guardados en Google Sheets');
    console.log('Response:', response.data);

    return { success: true };
  } catch (error) {
    console.error('❌ Error al guardar en Google Sheets:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

// ENDPOINT PRINCIPAL
app.post('/api/contact', async (req, res) => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 Nueva solicitud recibida');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    let data = req.body;

    // Sanitizar campos de texto
    const camposSanitizar = ['nombreCompleto', 'empresa', 'cargo', 'asunto', 'mensaje'];
    camposSanitizar.forEach(campo => {
      if (data[campo]) {
        data[campo] = sanitizeInput(data[campo]);
      }
    });

    // Validaciones
    if (!data.nombreCompleto || data.nombreCompleto.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener al menos 3 caracteres'
      });
    }

    if (!isValidEmail(data.email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    if (!isValidPhone(data.telefono)) {
      return res.status(400).json({
        success: false,
        message: 'Teléfono inválido (debe tener 10 dígitos)'
      });
    }

    if (!data.mensaje || data.mensaje.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje debe tener al menos 20 caracteres'
      });
    }

    // Generar ticket ID
    const ticketId = `SIN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    data.ticketId = ticketId;
    data.fecha = new Date().toLocaleDateString('es-EC');
    data.hora = new Date().toLocaleTimeString('es-EC');

    console.log('Datos recibidos:', {
      nombre: data.nombreCompleto,
      email: data.email,
      servicio: data.servicio,
      ticketId: ticketId
    });

    // Procesar solicitud
    let emailSuccess = false;
    let sheetsSuccess = false;
    let errors = [];

    // Intentar enviar email
    try {
      await enviarEmail(data);
      emailSuccess = true;
      console.log('✅ Email enviado exitosamente');
    } catch (emailError) {
      console.error('❌ Error en envío de email:', emailError.message);
      errors.push(`Email: ${emailError.message}`);
    }

    // Intentar guardar en Sheets
    try {
      await guardarEnGoogleSheets(data);
      sheetsSuccess = true;
      console.log('✅ Datos guardados en Sheets exitosamente');
    } catch (sheetsError) {
      console.error('❌ Error en Google Sheets:', sheetsError.message);
      errors.push(`Sheets: ${sheetsError.message}`);
    }

    // Responder según resultados
    if (emailSuccess || sheetsSuccess) {
      console.log('\n✅ Solicitud procesada (parcial o totalmente)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      res.json({
        success: true,
        message: 'Solicitud enviada exitosamente',
        ticketId: ticketId,
        details: {
          emailEnviado: emailSuccess,
          datosGuardados: sheetsSuccess,
          errores: errors.length > 0 ? errors : undefined
        }
      });
    } else {
      console.log('\n❌ Error: No se pudo procesar la solicitud');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      res.status(500).json({
        success: false,
        message: 'Error al procesar la solicitud',
        errores: errors
      });
    }

  } catch (error) {
    console.error('\n❌ Error en /api/contact:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud. Por favor intente nuevamente.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    config: {
      port: PORT,
      gmailUser: process.env.GMAIL_USER,
      spreadsheetId: SPREADSHEET_ID ? 'Configurado' : 'NO CONFIGURADO'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint no encontrado' 
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🛡️  SINERGIA SECURITY BACKEND                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.GMAIL_USER}`);
  console.log(`📊 Google Sheets ID: ${SPREADSHEET_ID || 'NO CONFIGURADO'}`);
  console.log('\n📝 Endpoints disponibles:');
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`   GET  http://localhost:${PORT}/api/health\n`);
});