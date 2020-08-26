/**
 * Checks temperature from AmbientWeather API and writes results into Google Sheet. Sends email in the afternoon when outside falls below inside temperature.
 * The message for the temperature switch is useful to message the user to stop the air condition and open windows to let colder air from outside into the house.
 * A threshold temperature can be used to limit the message to times where the indoor temperature is sufficiently high to require opening the windows.
 * Historical temperatures are kept in a Google sheet doc called House Temperatures; a new sheet within the doc is started every month.
 * This function should be called through a time-based trigger; it's recommended to call every 2 minutes or less as a spreadsheet can only hold 40k rows in a sheet.
 */
function checkTemperature() { 
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var dataAll = JSON.parse(response.getContentText());
  
  var device = dataAll[0];
  var temp = [];
  temp[0] = device.lastData.tempinf; // Weather station sensor
  
  for (i = 1; i < sensorLabels.length; i++){
    temp[i] = device.lastData["temp"+i+"f"];
  }

  Logger.log(temp[1]);
  
  var oldInTemp=50.0; // Fake temps if new sheet
  var oldOutTemp=70.0;
  var newInTemp=temp[indexIndoorSensor];
  var newOutTemp=temp[indexOutdoorSensor];
  
  var spreadsheetName = "House Temperatures";
  var spreadsheetId = getIdFromName(spreadsheetName);
  var sheet;
  var msgSheet;
  var lastMsgDate = null;
  var lastTempDate = null;
  var dateNow = new Date();
  var dateNowStr =  Utilities.formatDate(dateNow,
                                         'America/Los_Angeles', "MM/dd/yyyy hh:mm:ss"); 

  if (null != spreadsheetId) {
    doc = SpreadsheetApp.openById(spreadsheetId);
    sheet = doc.getSheetByName("Temps");
    msgSheet = doc.getSheetByName("Messages");
    oldOutTemp= sheet.getRange(2, indexOutdoorSensor+2).getValue();
    oldInTemp= sheet.getRange(2, indexIndoorSensor+2).getValue();
    lastMsgDate = msgSheet.getRange(2, 1).getValue();
    lastTempDate = sheet.getRange(2, 1).getValue();
    
    Logger.log(dateNow.getMonth()+"!="+lastTempDate.getMonth());
    if (dateNow.getMonth()!=lastTempDate.getMonth()) {
      sheet.setName(""+(lastTempDate.getMonth()+1)+"/"+lastTempDate.getFullYear());
      var oldSheet=sheet;
      sheet = doc.insertSheet();
      initSheet(sheet);
      doc.setActiveSheet(oldSheet);
      doc.moveActiveSheet(3);
      doc.setActiveSheet(sheet);
    }
    
  } else {
    doc = SpreadsheetApp.create(spreadsheetName);
    sheet = doc.getActiveSheet();
    initSheet(sheet);
    msgSheet = doc.insertSheet();
    msgSheet.setName("Messages");
    msgSheet.getRange(1, 1).setValue("Date");
    msgSheet.getRange(1, 2).setValue("Out New");
    msgSheet.getRange(1, 3).setValue("In New");
    msgSheet.getRange(1, 4).setValue("Out Old");
    msgSheet.getRange(1, 5).setValue("In Old"); 
  }
  
  sheet.insertRowAfter(1);
  sheet.getRange(2, 1).setValue(dateNowStr);
  for (i = 0; i < temp.length; i++){
    sheet.getRange(2, i+2).setValue(temp[i]);
  }
  
  // Check for indoor falling under outdoor temp 
  if (!isSameDate(dateNow, lastMsgDate) && dateNow.getHours() >= 12 &&
    oldOutTemp>=oldInTemp && newOutTemp<newInTemp && (thresholdTemp>0 && newInTemp > thresholdTemp)) {
    var message = "Outdoor " + newOutTemp + " colder than indoor " + newInTemp +";" + "old outdoor:"+oldOutTemp+" old indoor temp:"+oldInTemp;
    Logger.log(message);
    var subject = 'Outdoor temp under indoor';
    MailApp.sendEmail(emailAddress, subject, message);
    
    //Write to Messages sheet
    msgSheet.insertRowAfter(1);
    msgSheet.getRange(2, 1).setValue(dateNowStr);
    msgSheet.getRange(2, 2).setValue(newOutTemp);
    msgSheet.getRange(2, 3).setValue(newInTemp);
    msgSheet.getRange(2, 4).setValue(oldOutTemp);
    msgSheet.getRange(2, 5).setValue(oldInTemp);
  }
}

/**
 * Get Sheet ID from filename; pick first file if multiple have same name
 */
function getIdFromName(spreadsheetName) {
   var spreadsheetId = null;
  
  fileList = DriveApp.getFilesByName(spreadsheetName)
  while (fileList.hasNext()) {
    spreadsheetId=fileList.next().getId();
    return spreadsheetId;
  }
  
  return null;
}

/**
 * Compare two dates, return true if both are same date.
 */
function isSameDate(date1, date2) {
  return (date1 instanceof Date && date2 instanceof Date && date1.getDay()==date2.getDay() && date1.getMonth()==date2.getMonth() && date1.getFullYear()==date2.getFullYear());
}

/**
 * Initialize new sheet with headers based on sensor labels
 */
function initSheet(sheet) {
  sheet.setName("Temps");
  sheet.getRange(1, 1).setValue("Date");
  for (i = 0; i < sensorLabels.length; i++){
     sheet.getRange(1, i+2).setValue(sensorLabels[i]);
  }  
}
  
