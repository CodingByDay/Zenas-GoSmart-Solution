Testno okolje:

Server: https://podpora-test.trendnet.si => ta nastavitev bi bilo dobro, da se da konfigurirat, kot pri WMS
User: igor
Pass: test123

Prijavni ekran:

Če se je uporabnik v aplikacijo že prijavljal in ima shranjen session ID že od prej, najprej preverimo, 
če je le-ta še veljaven:

    GET /nfxapi/user/check/{sessionID}

in dobimo Success = true, če session ID še velja. V tem primeru ponovna prijava uporabnika ni potrebna, 
za nadaljnje delo se uporabi stari session ID.

    {
        "Success": true,
        "Error": null
    }

če dobimo Success = false (oz. če session ID od prej še nimamo), potem se mora uporabnik prijaviti in dobiti nov session ID:

    POST /nfxapi/user/login

    {
        "Username": "igor",
        "Password": "test123"
    }

in dobimo odziv, ki vsebuje SessionID za nadaljnje delo:

    {
        "SessionID": "API_c23358a2-f1e7-4cd8-8357-4446867089e8",
        "Success": true,
        "Error": null
    }


Seznam taskov:

Pridobimo z:

    GET /nfxapi/task/listOwn/{sessionID}

in dobimo osnovni seznam odprtih taskov uporabnika:

    {
        "Success": true,
        "Error": null,
        "Tasks": [
            {
                "Guid": "683aaa84-4139-4294-81c9-b14aca9218fc",
                "Client": "Werner Künzl",
                "Description": "[.] Izvedba montaže za: 230355 Werner Künzl SL 170/28",
                "PlannedDate": "2024-03-15T00:00:00"
            },
            {
                "Guid": "f99cb656-e480-4de8-a59c-bc213ac70107",
                "Client": "Johannes Spiessberger",
                "Description": "[.] Izvedba montaže za: 230255 Johannes Spiessberger - SL170-28",
                "PlannedDate": "2024-03-14T00:00:00"
            },
            {
                "Guid": "18c4eaa5-2f00-4236-88dd-bfae9c49f32a",
                "Client": "Werner Künzl",
                "Description": "Izvedba meritev za: 230355 Werner Künzl SL 170/28",
                "PlannedDate": "2024-01-22T00:00:00"
            },
            {
                "Guid": "2f819411-f54e-435f-b810-8e74424f31cd",
                "Client": "Werner Künzl",
                "Description": "Izvedba meritev za: 230355 Werner Künzl SL 170/28",
                "PlannedDate": "2024-01-22T00:00:00"
            }
        ]
    }

Podrobnosti taska:

Ko uporabnik izbere task, podrobnosti taska dobimo z:

    GET /nfxapi/task/get/{sessionID}/{taskGuid}

Odziv vrne "milijon" podatkov (serializira vse, kar o tasku ve).

    {
        "Success": true,
        "Error": null,
        "Task": {
            ...
        }
    }


Kaj točno od podatkov o tasku boš potreboval, se uskladimo, ko boš tako daleč. Enako glede zaključevanja, prenosa slik, ...

opis tezave
opis dela
dogovor

ce se nisu zakljuceni taski v preteklosti so rdeci