/**
 * Google Apps Script web app for RSVP submissions.
 *
 * Sheet setup: Create a sheet named "RSVP" with header row:
 *   Tidsstampel | E-post | Extraungar dopfika | Meddelande | Peppade | Gästnamn | Kommer | Kost | Kostdetalj
 *
 * Deploy: Deploy > New deployment > Web app
 *   Execute as: Me
 *   Who has access: Anyone
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVP");
    var data = JSON.parse(e.postData.contents);
    var ts = new Date().toISOString();
    var anyAttending = (data.guests || []).some(function (g) { return g.attending; });

    // Submission-level row
    sheet.appendRow([
      ts,
      data.email || "",
      anyAttending ? (data.extraKids || 0) : "",
      anyAttending ? (data.message || "") : "",
      anyAttending ? (data.peppade ? "Ja" : "Nej") : "",
      "",
      "",
      "",
      ""
    ]);

    // One row per guest
    var guests = data.guests || [];
    for (var i = 0; i < guests.length; i++) {
      sheet.appendRow([
        "",
        "",
        "",
        "",
        "",
        guests[i].name || "",
        guests[i].attending ? "Ja" : "Nej",
        guests[i].diet || "",
        guests[i].dietDetail || ""
      ]);
    }

    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
