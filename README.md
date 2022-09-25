## Uždavinio aprašymas

Projekto tema – miesto plėtros sistema

### Sistemos paskirtis

Sistema skirta pildyti ir peržiūrėti miesto plėtros informaciją. 


Naujos gatvės registruojamos į sistemą. Kiekviena gatvė turi informaciją apie joje esamus sklypus. 

Kiekvienas sklypas papildomai saugo informaciją apie sklypo statinius(butas, namas, aikštelė, t.t...).


### Funkciniai reikalavimai

Naudotojai skirstomi į tris roles.

Svečias gali:
1.	Prisiregistruoti.
2.	Peržiūrėti informaciją apie individualias gatves, sklypus, statinius.
3.	Gauti sąrašą gatvių, sklypų, statinių.
4.	Gauti sklypą, atsižvelgiant į gatvę
5.	Gauti statinį atsižvelgiant į gatvę ir sklypą.

Registruotas vartotojas gali:
1.	Tą patį ką ir svečias (negali tik prisiregistruoti)
2.	Prisijungti.
3.	Atsijungti.
4.	Sudaryti naują gatvės/sklypo/statinio įrašą:

4.1.	Atnaujint savo įrašo informaciją,

4.2.	ištrinti savo įrašą,

Administratorius gali:
1.	Turi tas pačias teises kaip registruotas vartotojas.
2.	Sukurti daugiau administratoriaus rolės vartotojų
3.	Panaikinti kitų vartotojų įrašus.

## Sistemos architektūra

Žemiau vaiduojama diegimo diagrama. 


Aplikacija bei jos duomenų bazė talpinama į Azure. Iš „Plotzemis HTML“ per https parsisiunčiama kliento pusės logika (bundle.js), kuri vykdoma kliento kompiuteryje, naršyklėje. Naršyklė pateikia tinklapio puslapį ir bendrauja su API per https protokolą. Tuo tarpu, duomenų bazė talpinama į docker konteinerį ir pasiekiama per tcp (angl.) „port“ 5432

![Screenshot](docImages/DeploymentDiagram.jpg)

## Naudotojo sąsajos projektas

## API specifikacija

Kiekvienas api POST/PUT metodas papildomai atlieka duomenų validaciją, kad neužpildytų duomenų bazės tuščiais duomenimis.

### street

#### /api/user/street POST

##### URL

```
http://localhost:9090/api/user/street/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| name | taip | gatvės pavadinimas |  | partizanu g.50 |
| city | taip | miestas, kuriame gatvė |  | Kaunas |
| district | taip | rajonas, kuriame gatvė |  | Žaliakalnis |
| postalCode | taip | pašto kodas | 0 | 56485 |
| addressCount | taip | adresų skaičius gatvėje | 0 | 123 |
| streetLength | taip | gatvės ilgis | 0 | apie 240 metrų |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "name":"partizanu g.50",
    "city":"Kaunas",
    "district":"Žaliakalnis",
    "postalCode":"56485",
    "addressCount":123,
    "streetLength":"apie 240 metrų"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 1,
        "userId": 1,
        "name": "partizanu g.50",
        "city": "Kaunas",
        "district": "Žaliakalnis",
        "postalCode": "56485",
        "addressCount": 123,
        "streetLength": "apie 240 metrų"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/street GET

##### URL

```
http://localhost:9090/api/street/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| name | taip | gatvės pavadinimas |  | partizanu g.50 |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "name":"partizanu g.50"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "result": {
        "Id": 1,
        "userId": 1,
        "name": "partizanu g.50",
        "city": "Kaunas",
        "district": "Žaliakalnis",
        "postalCode": "56485",
        "addressCount": 123,
        "streetLength": "apie 240 metrų"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/street/all GET

##### URL

```
http://localhost:9090/api/street/all
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| nereikia parametrų  |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
```

##### Pavyzdinis atsakymas

```
{
    "result": [
        {
            "Id": 1,
            "userId": 1,
            "name": "partizanu g.50",
            "city": "Kaunas",
            "district": "Žaliakalnis",
            "postalCode": "56485",
            "addressCount": 123,
            "streetLength": "apie 240 metrų"
        },
        {
            "Id": 2,
            "userId": 1,
            "name": "partizanu g.501",
            "city": "Kaunas",
            "district": "Žaliakalnis",
            "postalCode": "56485",
            "addressCount": 123,
            "streetLength": "apie 240 metrų"
        },
        {
            "Id": 3,
            "userId": 1,
            "name": "savanoriu prospektas",
            "city": "Kaunas",
            "district": "Žaliakalnis",
            "postalCode": "56485",
            "addressCount": 123,
            "streetLength": "apie 240 metrų"
        }
    ],
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/street PUT

##### URL

```
http://localhost:9090/api/user/street/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| oldName | taip | pavadinimas prieš pakeitimą |  | savanoriu prospektas |
| newName | ne | pavadinimas po pakeitimo |  | Vilniaus gatve |
| postalCode | ne | pašto kodas |  | 12345 |
| addressCount | ne | adresų skaičius gatvėje |  | 101 |

##### Pavyzdinė užklausa

```
curl -X PUT '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "oldName":"savanoriu prospektas",
    "newName":"Vilniaus gatve",
    "postalCode":"12345",
    "addressCount": 101
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 3,
        "userId": 1,
        "name": "Vilniaus gatve",
        "city": "Kaunas",
        "district": "Žaliakalnis",
        "postalCode": "12345",
        "addressCount": 101,
        "streetLength": "apie 240 metrų"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/street/remove REMOVE

##### URL

```
http://localhost:9090/api/user/street/remove
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| name | taip | gatvės pavadinimas |  | partizanu g.50 |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "name":"partizanu g.50"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": "Street as well as plots and buildings associated with it have been removed",
    "success": "true"
}
```

Atsako kodas: 200

#### /api/admin/street/remove REMOVE

##### URL

```
http://localhost:9090/api/admin/street/remove
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | taip        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| name | taip | gatvės pavadinimas |  | partizanu g.50 |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "name":"pavyzdys"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "error": " Authorization header is missing or there's no bearer"
}
```

Atsako kodas: 401


### Plot

#### /api/user/plot POST

##### URL

```
http://localhost:9090/api/user/plot/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas |  | partizghjanu gatve |
| lotNo | taip | ploto numeris | 0 | 52 |
| areaSize | taip | žemės plotas arais | 0 | 20 |
| purpose | taip | ploto paskirtis. Gali būti sandėliss/gyvenamasis/agrikultūrinis/miškininkystės |  | agrikultūrinis |
| type | taip | ploto tipas. Gali būti nuomojamas/parduodamas/neparduodamas |  | neparduodamas |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110,
    "areaSize":5,
    "purpose":"Gyvenamasis",
    "type":"parduodamas"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 1,
        "userId": 1,
        "streetName": "partizanu g.50",
        "lotNo": 110,
        "areaSize": 5,
        "purpose": "Gyvenamasis",
        "type": "parduodamas"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/plot GET

##### URL

```
http://localhost:9090/api/plot/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas |  | partizghjanu gatve |
| lotNo | taip | ploto numeris | 0 | 52 |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110
}
'
```

##### Pavyzdinis atsakymas

```
{
    "result": {
        "Id": 1,
        "userId": 1,
        "streetName": "partizanu g.50",
        "lotNo": 110,
        "areaSize": 5,
        "purpose": "Gyvenamasis",
        "type": "parduodamas"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/plot/all GET

##### URL

```
http://localhost:9090/api/plot/all
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| neturi parametrų |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
```

##### Pavyzdinis atsakymas

```
{
    "result": [
        {
            "Id": 1,
            "userId": 1,
            "streetName": "partizanu g.50",
            "lotNo": 110,
            "areaSize": 5,
            "purpose": "Gyvenamasis",
            "type": "parduodamas"
        },
        {
            "Id": 2,
            "userId": 1,
            "streetName": "partizanu gatve",
            "lotNo": 8,
            "areaSize": 20,
            "purpose": "Gyvenamasis",
            "type": "neparduodamas"
        },
        {
            "Id": 3,
            "userId": 1,
            "streetName": "partizanu gatve",
            "lotNo": 52,
            "areaSize": 20,
            "purpose": "sandėlis",
            "type": "neparduodamas"
        },
        {
            "Id": 4,
            "userId": 1,
            "streetName": "partizghjanu gatve",
            "lotNo": 52,
            "areaSize": 20,
            "purpose": "agrikultūrinis",
            "type": "neparduodamas"
        }
    ],
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/plot PUT

##### URL

```
http://localhost:9090/api/user/plot
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas |  | partizghjanu gatve |
| lotNo | taip | ploto numeris | 0 | 52 |
| areaSize | ne | žemės plotas arais | 0 | 20 |
| purpose | ne | ploto paskirtis. Gali būti sandėliss/gyvenamasis/agrikultūrinis/miškininkystės |  | agrikultūrinis |
| type | ne | ploto tipas. Gali būti nuomojamas/parduodamas/neparduodamas |  | neparduodamas |

##### Pavyzdinė užklausa

```
curl -X PUT '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "areaSize":1000,
    "purpose":"Gyvenamasis",
    "type":"parduodamas"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 1,
        "userId": 1,
        "streetName": "partizanu g.50",
        "lotNo": 110,
        "areaSize": 1000,
        "purpose": "Gyvenamasis",
        "type": "parduodamas"
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/plot/remove REMOVE

##### URL

```
http://localhost:9090/api/user/plot/remove
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|  |  |  |  |  |
|  |  |  |  |  |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": "Plot as well as buildings present in this plot have been removed",
    "success": "true"
}
```

Atsako kodas: 200

#### /api/admin/plot/remove REMOVE

| streetName | taip | gatvės pavadinimas |  | partizghjanu gatve |
| lotNo | taip | ploto numeris | 0 | 52 |

##### URL

```
http://localhost:9090/api/admin/plot
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | taip        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|  |  |  |  |  |
|  |  |  |  |  |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110
}
'
```

##### Pavyzdinis atsakymas

```
{
    "error": "You do not have admin privileges"
}
```

Atsako kodas: 401

### Building

#### /api/user/building POST

##### URL

```
http://localhost:9090/api/user/building
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas, kuriame yra pastatas |  | partizanu gatvė |
| lotNo | taip | ploto numeris, kuriame yra pastatas | 0 | 110 |
| streetNumber | taip | pastato gatvės numeris |  | 25A |
| type | taip | Pastato tipas. Pavyzdžiui butas, garažas, namas. Parametro pasirinkimai neribojami |  | butas |
| areaSize | taip | plotas kvadratiniais metrais | 0 | 5 |
| floorCount | taip | aukštų skaičius. Bus 0, jeigu pastatas yra aikštelė ar panašiai | 0 | 10 |
| year | taip | metai, kada buvo pastatytas | 0 | 1999 |
| price | taip | kaina eurais | 0 | 234232 |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110,
    "streetNumber":"25A",
    "type":"butas",
    "areaSize":5,
    "floorCount":10,
    "year":1999,
    "price":234232
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 1,
        "userId": 1,
        "streetName": "partizanu g.50",
        "lotNo": 110,
        "streetNumber": "25A",
        "type": "butas",
        "areaSize": 5,
        "floorCount": 10,
        "year": 1999,
        "price": 234232
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/building GET

##### URL

```
http://localhost:9090/api/building/
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas, kuriame yra pastatas |  | partizanu gatvė |
| lotNo | taip | ploto numeris, kuriame yra pastatas | 0 | 110 |
| streetNumber | taip | pastato gatvės numeris |  | 25A |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu gatve 50",
    "lotNo":110,
    "streetNumber":"25A"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "error": "building with this street name, lot number and street number not found"
}
```

Atsako kodas: 404

#### /api/building/all GET

##### URL

```
http://localhost:9090/api/building/all
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | ne       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| nereikia parametrų |

##### Pavyzdinė užklausa

```
curl -X GET '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
```

##### Pavyzdinis atsakymas

```
{
    "result": [
        {
            "Id": 1,
            "userId": 1,
            "streetName": "partizanu g.50",
            "lotNo": 110,
            "streetNumber": "25A",
            "type": "butas",
            "areaSize": 5,
            "floorCount": 10,
            "year": 1999,
            "price": 234232
        },
        {
            "Id": 2,
            "userId": 1,
            "streetName": "partizanu g.555",
            "lotNo": 110,
            "streetNumber": "25A",
            "type": "butas",
            "areaSize": 5,
            "floorCount": 10,
            "year": 1999,
            "price": 234232
        }
    ],
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/building PUT

##### URL

```
http://localhost:9090/api/user/building
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas, kuriame yra pastatas |  | partizanu gatvė |
| lotNo | taip | ploto numeris, kuriame yra pastatas | 0 | 110 |
| streetNumber | taip | pastato gatvės numeris |  | 25A |
| type | ne | Pastato tipas. Pavyzdžiui butas, garažas, namas. Parametro pasirinkimai neribojami |  | butas |
| areaSize | ne | plotas kvadratiniais metrais | 0 | 5 |
| floorCount | ne | aukštų skaičius. Bus 0, jeigu pastatas yra aikštelė ar panašiai | 0 | 10 |
| year | ne | metai, kada buvo pastatytas | 0 | 1999 |
| price | ne | kaina eurais | 0 | 234232 |

##### Pavyzdinė užklausa

```
curl -X PUT '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu g.50",
    "lotNo":110,
    "streetNumber":"25A",
    "year":2001,
    "price":234232
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": {
        "Id": 1,
        "userId": 1,
        "streetName": "partizanu g.50",
        "lotNo": 110,
        "streetNumber": "25A",
        "type": "butas",
        "areaSize": 5,
        "floorCount": 10,
        "year": 2001,
        "price": 234232
    },
    "success": "true"
}
```

Atsako kodas: 200

#### /api/user/building/remove REMOVE

##### URL

```
http://localhost:9090/api/user/building/remove
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | ne        |
| Gali vykdyti tik savo įrašams?   | taip        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas, kuriame yra pastatas |  | partizanu gatvė |
| lotNo | taip | ploto numeris, kuriame yra pastatas | 0 | 110 |
| streetNumber | taip | pastato gatvės numeris |  | 25A |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu gatve 50",
    "lotNo":110,
    "streetNumber":"25A"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "userId": 1
}{
    "result": "Post removed",
    "success": "true"
}
```

Atsako kodas: 200

#### /api/admin/building/remove REMOVE

##### URL

```
http://localhost:9090/api/admin/building
```

##### Resurso informacija

| Formatas      | Description |
| ----------- | ----------- |
| Reikalauja autentifikacijos?      | taip       |
| Reikalauja administratoriaus teisių?   | taip        |
| Gali vykdyti tik savo įrašams?   | ne        |

##### Parametrai

| Parametras      | Privalomas | Aprašas | numatyta reikšmė | Pavyzdys |
| ----------- | ----------- | ----------- | ----------- | ----------- |
| streetName | taip | gatvės pavadinimas, kuriame yra pastatas |  | partizanu gatvė |
| lotNo | taip | ploto numeris, kuriame yra pastatas | 0 | 110 |
| streetNumber | taip | pastato gatvės numeris |  | 25A |

##### Pavyzdinė užklausa

```
curl -X POST '' \
-H 'Accept: application/json' \
-H "Authorization: Bearer ${TOKEN}" \
-d '
{
    "streetName":"partizanu gatve 50",
    "lotNo":110,
    "streetNumber":"25A"
}
'
```

##### Pavyzdinis atsakymas

```
{
    "error": "You do not have admin privileges"
}
```

Atsako kodas: 401

## Išvados

- Būtina duomenų validacija backend'o pusėje. Neužtenka pasitikėti, jog frontend'o pusės perduodami duomenys bus tinkami.
- Atsako kodai aiškiai pateikia, kokia galima problema, net jeigu negrąžinamas užklausos kūnas
- Frontend'o aplikacija turi gebėti dinamiškai prisitaikyti prie įvairių įrenginio apribojimų. Pakeitus naršyklės lango dydį, duomenys privalo išlikti įskaitomi.
- Wireframe'ai palengvina frontend dalies projektavimą

## Šaltiniai

- https://www.bezkoder.com/react-typescript-login-example/
- https://www.npmjs.com/package/bootstrap/v/4.6.0
- https://formik.org/docs/guides/validation
- https://github.com/jquense/yup
- https://medium.com/@apzuk3/input-validation-in-golang-bc24cdec1835
- https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context
- https://levelup.gitconnected.com/microservices-with-go-grpc-api-gateway-and-authentication-part-1-2-393ad9fc9d30
- https://getbootstrap.com/
- https://react-bootstrap.github.io/getting-started/introduction
- https://stackoverflow.com/questions/49967779/axios-handling-errors
- https://github.com/briancodex/react-sidebar-dropdown