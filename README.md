# PG6301 eksamen Kristiania Avis

[Link til Heroku](https://pg6301-eksamen.herokuapp.com)




## Egenutfylling av tekniske krav

* [x] Lage en app med parcel, express, concurrently, prettier, Jest
*  implementert!
* [x] Sette opp en fungerende React app med React Router, håndtering av loading state og feilhåndtering
*  implementert, men ved bruk av "avansert" Web Socket kommunikasjon er ikke loading state til stedet for listing av artikler. Den finnes på login / delvis på lagring av artikler.
* [x] Sette opp en fungerende Express app inkludert Routes i egen fil
*  implementert!
* [x] Kommunikasjon mellom klient og server med GET og POST inkludert feilhåndtering
*  implementert, men igjen så tar Web Socket over mye av kommunikasjon for listing av artikler. Jeg fant/ikke hadde tid til å finne løsning for visning av feilene, men implementert stacktrace feilhåndtering.
* [x] Deployment til Heroku
*  implementert!
* [x] Lagring, henting og endring av data i Mongodb
*  implementert!
* [x] Login med OpenID Connect (både Google og Active Directory)
*  implementert!
* [x] Web Sockets
*  Her har jeg brukt meste av tiden min på eksamen, Web Sockets fungerer for alt som har med listing å gjøre, alle brukere kan sømløst se lagringer, oppdateringer og sletting.
* [/] Test coverage på 50-70% eller bedre dokumentert med Github Actions
*  Her mangler jeg nok litt coverage. Ved å implementere mye gjennom Web Sockets har testingen vært vanskelig. Jeg har testet så mye jeg kunne, men satt fast med npm jest som feiler, mens IntelliJ kjører grønt. 


## Egenutfylling av funksjonelle krav

* [x] Anonyme brukere skal se nyhetsaker når de kommer til nettsiden. Legg inn noen nyhetssaker for å demonstrere
* [x] Når en ny sak publiseres, skal alle brukerne få se den nye saken umiddelbart. Bruk websockets for å sende oppdateringer
* [x] Brukere kan logge seg inn. Det anbefales at du implementerer at brukerne logger seg inn med Google, men andre mekanismer er også akseptabelt
* [x] En bruker som er logget inn kan se på sin profilside (userinfo fra Google)
* [x] Brukere skal forbli logget inn når de refresher websiden
* [x] En bruker som er logget inn kan klikke på en nyhetssak for å se detaljene om nyhetssaken. Detaljene skal inkludere en nyhetskategori, overskrift, tekst og navn på den som publiserte den
* [x] "Redaksjonelle brukere" kan logge seg inn med Active Directory. Det må fungere å logge seg inn med en Active Directory
på skolens AD ( domain_hint=egms.no )
* [x] Redaksjonelle brukere kan publisere nye nyhetsartikler
* [x] Nyhetsartikkel skal inneholde en kategori valgt fra en nedtrekksliste ( <select> ), tittel ( <input> ) og tekst ( <textarea> )
* [x] Dersom noen allerede har publisert en nyhetsartikkel med samme tittel skal serveren sende HTTP status kode 400 og en feilmelding
* [x] Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler kategori, tittel eller tekst
* [x] En redaksjonell bruker skal kunne redigere en artikkel de selv har publisert
* [/] Alle feil fra serves skal presenteres til bruker på en pen måte, med mulighet for brukeren til å prøve igjen
* Ikke alle feil blir håndtert med visning, jeg fikk ikke nok tid til å implementere Web Sockets med loading state/context.
 
- Alle må krav er implementert
 
 - Ingen flere timer igjen på Github Actions:
 ![image](https://user-images.githubusercontent.com/71786017/167055157-b6a11608-02e6-4502-9039-e5f6794111f9.png)
 ![image](https://user-images.githubusercontent.com/71786017/167055357-ee4d6a2c-c85f-4f03-9af2-717f0735d7d9.png)


