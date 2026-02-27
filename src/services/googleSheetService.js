// import path and googleapis
const path = require('path');
const { google } = require('googleapis');

const sheets = google.sheets('v4');

//function to add row to google sheet
async function addRowToSheet(auth, spreadsheetId, range, values) {
  try {
    const request = {
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [values],
      },
      auth,
    };

    const response = await sheets.spreadsheets.values.append(request);
    console.log('Row added successfully:', response.data);
    return response;
  } catch (error) {
    console.error('Error adding row to sheet:', error);
  }
}
//const for authentication
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials/credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

//function to append to google sheet
async function appendToSheet(spreadsheetId, range, values) {
    try { 
        const authClient = await auth.getClient();
        const response = await addRowToSheet(authClient, spreadsheetId, range, values);
        console.log('Append to sheet response:', response.data);
        return response;
    }   catch (error) {
        console.error('Error appending to sheet:', error);
    }
}

module.exports = {
    appendToSheet,
};