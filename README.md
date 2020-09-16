# Home Temperature Monitor
Google Apps Script for collecting Home Temperature Readings from AmbientWeather REST API sending email alert when afternoon outdoor temperature drops below indoor value.

This collection of scripts collects temperatures from a connected home weather station such as [AmbientWeather WS-8482](https://www.ambientweather.com/amws8482x3.html). 
It stores the temperatures in short intervals (2 minutes and up) to a Google sheet doc. It sends an email alert in the afternoon when outside falls below inside temperature.
The message for the temperature switch is useful to message the user to stop the air condition and open windows to let colder air from outside into the house.
A threshold temperature can be used to limit the message to times where the indoor temperature is sufficiently high to require opening the windows.
Historical temperatures are kept in a Google sheet doc called House Temperatures; a new sheet within the doc is started every month.
This function should be called through a time-based trigger; it's recommended to call every 2 minutes or less as a spreadsheet can only hold 40k rows in a sheet.

Installation Steps:

1. Create Google Apps Script project at https://script.google.com/.
2. Import the *.gs files from GIT into the project. This can best be done using the [Google Apps Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=en).
3. Set up API access for your weather station, for example the [AmbientWeather API](https://www.ambientweather.com/api.html). You will need to collect your Application key and API key. For other connected weather stations you might have to modify the scripts to use alternative URLs, headers, and payload formatting. 
4. Edit the Config.gs file to set API keys and preferences for the weather station and data collection
5. Test the script by running the function checkTemperature.
6. Create a trigger to execute this script in >=2 minute intervals. You can go to Edit > Current Project's Triggers in the Script Editor. A trigger should be Time-Driven, Daily, 4pm-5pm PSTas this is the time that Santa Clara updates its stats.
