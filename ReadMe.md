# Club Online Booking
## Description
This project is a booking system for a sport club. It allows club officers to create and manage sessions and allows menbers to book those sessions.
It is being developed for a Shooting club, but can probably be adapted or simpy used for any sporting club
The functionality will start very basic and should develop over time as aditional functionality is required.  
  
The projects consists of three parts.
 - A Database MySql
 - A REST API
 - A User interface.
### API
The API is written in C# .Net Core 5
Tnterface with the database is with EntityFrameworkCore using NuGet package MySql.Data.EntityFrameworkCore.  
The API implements basic authentication and HTTPS.
### User Interface
The UI is an Angular 9 Project implementing the basic authentication required by the API.
## Hosting the WebApp
In production, the output from the UI project should be copied to the ClientApp/dist folder of the published API.
The web.config file might need modification depending on the hosting platform. (Compare published web.config with web.release.config)
## Repo Security
After cloning the repo, navigate to directory ./BaSbrcWeb/BaSbrcWeb and issue command "git update-index --assume-unchanged appsettings.json" before adding real connection string data to the appsettings.json file. That will stop the file being updated with the real connections string.

