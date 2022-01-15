# Rahasovellus

Sivu löytyy [täältä](https://rahasovellus.herokuapp.com/).

Sivusta ei saa paljon irti ilman kirjautumista. Voit kirjautua käyttäjänimellä demouser ja salasanalla vahvasalasana nähdäksesi sivun esimerkkidatalla varustettuna. Sivu toimii ainakin Chromella ja Firefoxilla, muista selaimista en tiedä.

Sivu on työkalu omien tulojen ja menojen seuraamiseen. Kun tapahtumia lisää tarpeeksi, omasta rahankäytöstään saa yksityiskohtaista dataa kaavioiden ja tunnuslukujen muodossa. Käyttäjä voi lisätä tuloille ja menoille omia kategorioita tai käyttää valmiita.

## Käytetyt teknologiat ja rakenne

- frontend: React, Redux, d3 (kaavioiden piirtoon)
- backend: Express, Mongoose, Passport

Kirjautumisjärjestelmä on toteutettu Passport.js:llä. Käyttäjätiedot tallennetaan express-sessioniin ja lähetetään käyttäjälle cookiena. Käyttäjätiedot ja tapahtumat tallennetaan MongoDB:hin.