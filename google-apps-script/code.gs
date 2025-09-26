/** Google Apps Script – Dom’Aide (v7.4)
 * - Reçoit les données des formulaires (demande/contact)
 * - Enregistre dans un Google Sheet
 * - Envoie un e-mail récapitulatif
 */
const SPREADSHEET_URL = 'PASTE_YOUR_SHEET_URL_HERE';
const TO_EMAIL = 'vincentbrennus1@outlook.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getActiveSheet();
    const p = e.parameter;
    const now = new Date();
    const isContact = (p.formType === 'contact');
    const row = [
      now, isContact ? 'contact' : 'demande',
      p.name || '', p.phone || '', p.email || '',
      p.address || '', p.service || '', p.selectedTarifLabel || '', p.selectedTarifUrl || '',
      p.magasin || '', p.reservation_name || '', p.pickup_time || '',
      p.travaux_details || p.it_details || p.divers_details || p.repas_details || p.message || '',
      p.details || ''
    ];
    sheet.appendRow(row);

    const subject = isContact ? 'Nouveau message – Dom’Aide' : 'Nouvelle demande – Dom’Aide';
    const body = isContact
      ? ('Nouveau message:\n\nNom: '+(p.name||'')+'\nEmail: '+(p.email||'')+'\nTéléphone: '+(p.phone||'')+'\nMessage: '+(p.message||'')+'\n\n-- Dom’Aide')
      : ('Nouvelle demande:\n\nNom: '+(p.name||'')+'\nTéléphone: '+(p.phone||'')+'\nEmail: '+(p.email||'')+'\nAdresse: '+(p.address||'')+'\nPrestation: '+(p.service||'')+'\nTarif: '+(p.selectedTarifLabel||'')+'\nLien Stripe: '+(p.selectedTarifUrl||'')+'\nDétails: '+(p.travaux_details || p.it_details || p.divers_details || p.repas_details || p.details || '')+'\n\n-- Dom’Aide');
    MailApp.sendEmail(TO_EMAIL, subject, body);

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err).setMimeType(ContentService.MimeType.TEXT);
  }
}
