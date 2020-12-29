TODOLIST 5000


Syfte: Att skapa en hemsida med enkel inloggning och möjlighet att
skapa, radera och organisera listor och uppgifter. Uppgifter ska ha olika
status faser som kan ändras under tidens gång.

Hantering: Lagrar data i form av skapade listor, inloggningsuppgifter och kategori.

Funktionalitet:

(a) Leverera en produkt där användare kan logga in med korrekta inloggningsuppgifter.

(b) Se nuvarande listor, skapa nya och radera befintliga listor.

(c) Varje lista ska ha möjlighet att ha en mängd skapade uppgifter med olika statusar. 
Användare ska ha möjlighet att skapa, radera och ändra uppgifter inklusive status.

(d) En enkel delningsfunktion där programmet skapar en unik url till en specifik lista
som ej kräver inloggning men som inte går att ändra.

(e) Om tid finns vill jag se över alternativ för att utöka säkerhet och
möjligheten till “scaling” genom en databas, exempelvis MongoDB


a) Enkel inloggning

b) Möjlighet att skapa och radera listor

c) Möjlighet att skapa, radera och ändra status på uppgifter

d) Möjlighet att dela lista med unik URL

e) Utöka säkerhet och “scaling” genom att implementera
en enklare databas för hantering av användare uppgift


WORK IN PROGRESS

BACKEND 

[X] NODEJS

[X] EXPRESS

[X] DB CONNECTION/MONGOOSE (MongoDB Atlas)

[X] ROUTES

[X] MIDDLEWARES

[X] JOI

[X] JTW TOKEN

[X] CREAT NEW USERS TO API

[X] LOGIN TO API

[X] CREAT NEW USERS ON WEBSITE

[ ] ERRORHANDLING ON API

[ ] SESSION

[X] STORE TOKEN IN LOCALSTORAGE/COOKIES

[X] GENERATE NEW LISTS BY USER, STORED IN DB

[X] DISPLAY CREATED LISTS ON DASHBOARD

[ ] ABILITY TO EDIT LISTS

[X] REMOVE LISTS

[ ] GENERATE PUBLIC PAGE IF USER USE SHARE FUNCTION WITH CURRENT LISTS IN DB, NOT

[X] LOGOUT/DISABLE ACTIVE TOKEN (REMOVE LOCALSTORAGE/COOKIE)

[ ] ADMIN ACCOUNT

[ ] ADMIN DASHBOARD TO BE ABLE TO ADD, EDIT AND REMOVE USERS IN DATABASE

[ ] ADMIN DASHBOARD TO SEE ALL LISTS CREATED IN DB AND SORT BY USER


FRONTEND 

[X] INDEX

[X] SIGN UP

[X] REGISTER

[50%] DASHBOARD (NOT ACCESSABLE WITHOUT TOKEN)

[X] CSS LINK

[X] JS LINK

[X] JS EVENT WHEN USER WANTS TO SEND FORM DATA TO BACKEND TO REGISTER NEW USER

[X] JS EVENT WHEN USER WANTS TO LOGIN TO BACKEND

[X] LOGIN FROM WEBSITE

[X] REDIRECT TO DASHBOARD WHEN LOGGED IN WITH TOKEN

[ ] WHEN LOGGED IN, USER SHOULD BE REDIRECTED TO /DASHBOARD WHEN VISITING /* or INDEX

[ ] DISPLAY LISTS IN DB CONNECTED TO USER

[X] EVENT TO CREAT NEW LISTS

[ ] EVENT TO CHANGE LISTS AND STATUS

[X] EVENT TO REMOVE LISTS

[X] LOGOUT
