# VirtualWallet Frontend

## Doel van het project

Dit is het frontend gedeelte van het 'VirtualWallet' project.
De bedoeling is om te beleggen met virtueel geld.
Dit project is beperkt tot enkele stocks en cryptocurrencies die men kan aankopen/verkopen met virtueel geld.
Als gebruiker kan je jezelf registreren en vervolgens inloggen. De bedoeling is om virtueel geld op je portefeuille te storten waarmee je aan de slag kan om aandelen te kopen/verkopen.
Het storten van dit virtueel geld kost uiteraard nep en kost geen echt geld.

De koersen worden in hun huidige configuratie via een externe API bijgewerkt in de backend.
Standaard is dit ingesteld op 24u, aangezien het verversen van deze gegevens via de gratis versie van de externe API eerder beperkt is.
Bij een betaalversie zou men kunnen opteren om dit aan te passen naar bijvoorbeeld 5 minuten per refresh om een echte 'stock exchange' ervaring na te bootsen.

Gebruikte valuta in dit project is Amerikaanse dollar (USD).

## Setup instructies

- Clone de repository
- Installeer Node.js indien dit nog niet is gebeurd (minimum v20.11.x vereist)
- Installeer de node modules met **npm install** (via CLI in project folder)
- Gebruik het commando **ng serve** om het project lokaal te hosten (http://localhost:4200)

### Mocking enablen/disablen

Wijzig 'mockApi' in het bestand `src/environments/environment.development.ts` naar **true** om mocking te enablen.
Dit stelt je in staat om het project grotendeels (niet volledig!) te testen zonder dat een backend vereist is.


## Structuur

### Componenten

Twee hoofdcomponenten met verschillende layouts:

- Authlayout: gebruiker kan hier inloggen/registreren
  - Login component: inloggen (gebruiker moet uiteraard eerst geregistreerd zijn)
  - Register component: registreren (controles op invoervelden van het formulier en checken of username al bestaat)
- Mainlayout: het platform zelf, enkel bereikbaar indien gebruiker is ingelogd
  - Market component: weergave van huidige koersen van stocks & crypto
  - Orders component: overzicht van historiek eigen orders + nieuwe orders invoeren
  - Wallet component: overzicht van holdings + 'cash' verwijderen/toevoegen
  - Topbar component: navigatiebalk bovenaan + uitloggen

### Services

De componenten injecteren verschillende services via interfaces.
Dit maakt het gemakkelijk om te schakelen tussen de echte services en de mock versie van elke service.

Voor de user service is uitzonderlijk een abstracte klasse aangemaakt.
Hierin staat een validator die door de abstracte klasse zowel in de mock service als gewone service hetzelfde blijft.
Deze validator maakt gebruik van de usernameExists functie om te controleren of een gebruikersnaam al bestaat of niet.
De usernameExists functie krijgt dus, afhankelijk van mocking of productie, een andere invulling.

Het injecteren van de services gebeurd via tokens:
```
private marketDataService = inject<IMarketDataService>(MARKETDATA_SERVICE_TOKEN);

```

Deze tokens staan in `src/app/tokens.ts` en hun invulling: `src/app/app.config.ts`. In `src/app/environments/environment.development.ts` staat de boolean waarde 'mockApi'.
Afhankelijk van deze waarde kan men gemakkelijk schakelen tussen de service klassen of gemockte service klassen.
In `src/app/app.config.ts` wordt op deze manier de juiste service bepaald:
```
const AuthServiceClass = environment.mockApi ? AuthmockService : AuthService;
```

### Signals

Aangezien het werken met signals de modernere, nieuwere manier van werken is, worden ze ook toegepast in dit project.
Dit project maakt onder andere gebruik van toSignal, toObservable, computed, effect en linkedSignal.
