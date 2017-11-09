# Information Design Opdracht A
Een school project met het hoofdonderwerp de top 10 cryptocurrencies.

## Beschrijving
In deze opdracht heb ik 3 inzichten verwerkt en met de d3 library gewerkt.
Hierin wordt data opgeschoont en de data staat op de juiste plek.

## Directory
Directory.
|
|-- css
|   |-- style.css 
|
|-- scripts/
|   |-- d3.js
|
|-- data/
|   |-- top100.csv

## Data cleaning
Hiermee pak ik de dataset en vervang ik al de overbodige tekens.
Met de data.sort functie zorg ik ervoor dat er numbers terug worden gestuurd.
``` Javascript
d3.csv("data/top100.csv", function(data) {
      data.Price = data.Price.replace('$', '')
      data.Price = data.Price.replace(',', '')
      data.MarketCap = data.MarketCap.replace('$', '')
      data.MarketCap =+ data.MarketCap.replace(/,/g, '')
      data.Change24h =+ data.Change24h.replace('%', '')
  return data;
}, function(error, data) {
  if (error) throw error;

    // Zorgt ervoor dat je de descended waardes krijg.
    data = data.sort(function(a, b){
      return parseFloat(b.Price) - parseFloat(a.Price);
    });

    // pakt de top 10.
    data = data.splice(0,10)
```
## Features
* d3-request — d3.csv — Loading files
* d3-scale — d3.scaleOrdinal — Position encodings
* d3-selection — d3.select — Select elements
