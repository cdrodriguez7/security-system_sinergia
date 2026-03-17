// ============================================
// ENDPOINT DE COTIZACIONES
// ============================================

// Función para guardar cotización en Google Sheets
async function guardarCotizacionEnSheets(data) {
  try {
    console.log('📊 Guardando cotización en Google Sheets...');
    
    const fecha = new Date();
    
    // Calcular totales
    const totalVehiculos = data.vehiculos.reduce((sum, v) => sum + v.cantidad, 0);
    
    // Convertir arrays a JSON string para almacenar en una celda
    const detalleVehiculos = JSON.stringify(data.vehiculos);
    const detalleEquipamiento = JSON.stringify(
      data.equipamiento.filter(e => e.seleccionado)
    );
    
    const row = [
      fecha.toISOString(),                          // A: Timestamp
      data.fecha,                                    // B: Fecha
      data.hora,                                     // C: Hora
      data.cotizacionId,                            // D: Cotización ID
      data.servicio,                                 // E: Servicio
      totalVehiculos,                                // F: Total Vehículos
      detalleVehiculos,                             // G: Detalle Vehículos (JSON)
      data.uniformePrincipal || '',                 // H: Uniforme Seleccionado
      detalleEquipamiento,                          // I: Equipamiento (JSON)
      'Pendiente',                                   // J: Estado
      '',                                            // K: Notas
      data.emailCliente || '',                      // L: Email Cliente
      data.telefonoCliente || '',                   // M: Teléfono Cliente
      data.ip || '',                                 // N: IP
      data.userAgent || ''                          // O: User Agent
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cotizaciones!A:O',                    // ⬅️ HOJA "Cotizaciones"
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] }
    });

    console.log('✅ Cotización guardada en Google Sheets');
    return { success: true };
  } catch (error) {
    console.error('❌ Error al guardar cotización en Sheets:', error.message);
    throw error;
  }
}

// POST /api/cotizacion - Guardar cotización sin datos del cliente
app.post('/api/cotizacion', async (req, res) => {
  try {
    console.log('\n📊 Nueva cotización recibida (sin cliente)');
    
    const data = req.body;
    
    // Validar datos mínimos
    if (!data.servicio || !data.vehiculos || data.vehiculos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos de cotización inválidos'
      });
    }
    
    // Generar ID único
    data.cotizacionId = `COT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    data.fecha = new Date().toLocaleDateString('es-EC');
    data.hora = new Date().toLocaleTimeString('es-EC');
    data.ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    data.userAgent = req.headers['user-agent'];
    
    console.log(`📝 Cotización ID: ${data.cotizacionId}`);
    console.log(`🚗 Total vehículos: ${data.vehiculos.reduce((sum, v) => sum + v.cantidad, 0)}`);
    console.log(`🛡️ Servicio: ${data.servicio}`);
    
    // Guardar en Google Sheets
    await guardarCotizacionEnSheets(data);
    
    res.json({
      success: true,
      message: 'Cotización guardada exitosamente',
      cotizacionId: data.cotizacionId,
      timestamp: data.fecha + ' ' + data.hora
    });
    
  } catch (error) {
    console.error('❌ Error al guardar cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al guardar cotización'
    });
  }
});

// POST /api/cotizacion/completa - Guardar cotización CON datos del cliente
app.post('/api/cotizacion/completa', async (req, res) => {
  try {
    console.log('\n📊 Nueva cotización COMPLETA recibida (con datos de cliente)');
    
    const data = req.body;
    
    // Validar datos del cliente
    if (!data.nombreCliente || !data.emailCliente || !data.telefonoCliente) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos del cliente'
      });
    }
    
    // Validar email y teléfono
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.emailCliente)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.telefonoCliente)) {
      return res.status(400).json({
        success: false,
        message: 'Teléfono inválido'
      });
    }
    
    // Generar o usar ID existente
    if (!data.cotizacionId) {
      data.cotizacionId = `COT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
    
    data.fecha = new Date().toLocaleDateString('es-EC');
    data.hora = new Date().toLocaleTimeString('es-EC');
    data.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    data.userAgent = req.headers['user-agent'];
    
    console.log(`📝 Cotización ID: ${data.cotizacionId}`);
    console.log(`👤 Cliente: ${data.nombreCliente} (${data.emailCliente})`);
    
    // Guardar en Google Sheets
    await guardarCotizacionEnSheets(data);
    
    // Enviar email de confirmación al cliente (opcional)
    try {
      await enviarEmailCotizacion(data);
    } catch (emailError) {
      console.error('⚠️ Error al enviar email de cotización:', emailError.message);
      // No fallar si el email no se envía
    }
    
    res.json({
      success: true,
      message: 'Cotización enviada exitosamente',
      cotizacionId: data.cotizacionId
    });
    
  } catch (error) {
    console.error('❌ Error al procesar cotización completa:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar cotización'
    });
  }
});

// Función para enviar email de cotización (opcional)
async function enviarEmailCotizacion(data) {
  try {
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
    
    // Email para el equipo
    const totalVehiculos = data.vehiculos.reduce((sum, v) => sum + v.cantidad, 0);
    const equipamientoSeleccionado = data.equipamiento
      .filter(e => e.seleccionado)
      .map(e => e.nombre)
      .join(', ');
    
    const mailOptionsTeam = {
      from: `Sinergia Security <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Nueva Cotización: ${data.servicio.toUpperCase()} - ${data.nombreCliente}`,
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Nueva Cotización Personalizada</h1>
              <p>Sinergia Security Solutions</p>
            </div>
            <div class="content">
              <div class="info-row">
                <div class="label">Cotización ID:</div>
                <div class="value">${data.cotizacionId}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Servicio:</div>
                <div class="value">${data.servicio}</div>
              </div>
              
              <h3 style="color: #1a1d23; margin-top: 30px;">Datos del Cliente</h3>
              
              <div class="info-row">
                <div class="label">Nombre:</div>
                <div class="value">${data.nombreCliente}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.emailCliente}">${data.emailCliente}</a></div>
              </div>
              
              <div class="info-row">
                <div class="label">Teléfono:</div>
                <div class="value"><a href="tel:${data.telefonoCliente}">${data.telefonoCliente}</a></div>
              </div>
              
              ${data.empresaCliente ? `
              <div class="info-row">
                <div class="label">Empresa:</div>
                <div class="value">${data.empresaCliente}</div>
              </div>
              ` : ''}
              
              <h3 style="color: #1a1d23; margin-top: 30px;">Configuración Solicitada</h3>
              
              <div class="info-row">
                <div class="label">Total de Vehículos:</div>
                <div class="value">${totalVehiculos} unidades</div>
              </div>
              
              <div class="info-row">
                <div class="label">Detalle de Vehículos:</div>
                <div class="value">
                  ${data.vehiculos.map(v => `${v.cantidad}x ${v.tipo.toUpperCase()}`).join('<br>')}
                </div>
              </div>
              
              ${data.uniformePrincipal ? `
              <div class="info-row">
                <div class="label">Uniforme Principal:</div>
                <div class="value">${data.uniformePrincipal}</div>
              </div>
              ` : ''}
              
              ${equipamientoSeleccionado ? `
              <div class="info-row">
                <div class="label">Equipamiento Adicional:</div>
                <div class="value">${equipamientoSeleccionado}</div>
              </div>
              ` : ''}
              
              ${data.mensajeAdicional ? `
              <div class="info-row">
                <div class="label">Mensaje del Cliente:</div>
                <div class="value">${data.mensajeAdicional}</div>
              </div>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // Email de confirmación al cliente
    const mailOptionsClient = {
      from: `Sinergia Security <${process.env.GMAIL_USER}>`,
      to: data.emailCliente,
      subject: 'Confirmación de Cotización - Sinergia Security',
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Cotización Recibida</h1>
              <p>Gracias por tu interés en Sinergia Security</p>
            </div>
            <div class="content">
              <p>Estimado/a <strong>${data.nombreCliente}</strong>,</p>
              
              <p>Hemos recibido tu solicitud de cotización personalizada para <strong>${data.servicio}</strong>.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #1a1d23;">📋 ID de tu Cotización</h3>
                <p style="font-size: 1.5rem; font-weight: 900; color: #487FC0; margin: 0;">${data.cotizacionId}</p>
              </div>
              
              <p><strong>Resumen de tu configuración:</strong></p>
              <ul>
                <li>Total de vehículos: <strong>${totalVehiculos}</strong></li>
                ${data.uniformePrincipal ? `<li>Uniforme: <strong>${data.uniformePrincipal}</strong></li>` : ''}
                ${equipamientoSeleccionado ? `<li>Equipamiento: <strong>${equipamientoSeleccionado}</strong></li>` : ''}
              </ul>
              
              <p><strong>¿Qué sigue?</strong></p>
              <ul>
                <li>Nuestro equipo preparará una cotización detallada</li>
                <li>Nos pondremos en contacto contigo en menos de 24 horas</li>
                <li>Recibirás un presupuesto personalizado basado en tu configuración</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="tel:+593999999999" class="cta-button">📞 Llamar Ahora: +593 99 999 9999</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptionsTeam);
    console.log('✅ Email de cotización enviado al equipo');
    
    await transporter.sendMail(mailOptionsClient);
    console.log('✅ Email de confirmación enviado al cliente');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error al enviar email de cotización:', error.message);
    throw error;
  }
}

// GET /api/cotizacion/:id - Obtener cotización por ID (opcional)
app.get('/api/cotizacion/:id', async (req, res) => {
  try {
    const cotizacionId = req.params.id;
    
    // Buscar en Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Cotizaciones!A:O'
    });
    
    const rows = response.data.values || [];
    const cotizacion = rows.find(row => row[3] === cotizacionId); // Columna D: Cotización ID
    
    if (!cotizacion) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: {
        timestamp: cotizacion[0],
        fecha: cotizacion[1],
        hora: cotizacion[2],
        cotizacionId: cotizacion[3],
        servicio: cotizacion[4],
        totalVehiculos: cotizacion[5],
        vehiculos: JSON.parse(cotizacion[6]),
        uniforme: cotizacion[7],
        equipamiento: JSON.parse(cotizacion[8]),
        estado: cotizacion[9]
      }
    });
    
  } catch (error) {
    console.error('❌ Error al obtener cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cotización'
    });
  }
});