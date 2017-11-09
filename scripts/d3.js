
/*////////////////////////////////////////////////////////////////////////////

Sources:
  https://bl.ocks.org/mbostock/3885304 - Mike Bostock’s
  https://bl.ocks.org/ch-bu/f3d1fc6e905f80b0706663fbefe317bc - Christian Burkhart’s
  https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998 - Alan Dunning’s

  Svg bar-tool

/*////////////////////////////////////////////////////////////////////////////


// Hierin zet ik alle waardes voor de svg klaar om te gebruiken.
// Ik maak ze uniek zodat ze niet met de andere svg's worden geladen.

var svgPrice = d3.select("#bar-tool"),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 80},

    widthTool = +svgPrice.attr("width") - margin.left - margin.right,
    heightTool = +svgPrice.attr("height") - margin.top - margin.bottom;

var tooltipBarTool = d3.select("body").append("div").attr("class", "toolTip");

var xPrice = d3.scaleLinear().range([0, widthTool]);
var yPrice = d3.scaleBand().range([heightTool, 0]);

var gPrice = svgPrice.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*////////////////////////////////////////////////////////////////////////////

  SVG Barchart Positive and Negative value.

/*////////////////////////////////////////////////////////////////////////////

// unieke waardes zodat ik ze straks kan manipuleren.
var margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 30
};
var heightPN = 460 - margin.top - margin.bottom;
var widthPN = 900 - margin.left - margin.right;

// Add svg to
var svgPN = d3.select('#PN')
  .attr('width', widthPN + margin.left + margin.right)
  .attr('height', heightPN + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// X scale
var xPN = d3.scaleLinear()
  .range([0, widthPN])
var yPN = d3.scaleBand()
  .rangeRound([heightPN, 0]);


var xAxisPN = d3.axisBottom(xPN);
var yAxisPN = d3.axisLeft(yPN)
  .tickSize(6, 0);
/*////////////////////////////////////////////////////////////////////////////

  SVG Barchart

/*////////////////////////////////////////////////////////////////////////////

// unieke waardes zodat ik ze straks kan manipuleren.
var svgBar = d3.select("#barchart"),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 100
    },
    widthBar = +svgBar.attr("width") - margin.left - margin.right,
    heightBar = +svgBar.attr("height") - margin.top - margin.bottom;

var xBar = d3.scaleBand().rangeRound([0, widthBar]).padding(0.1),
    yBar = d3.scaleLinear().rangeRound([heightBar, 0]);

var gBar = svgBar.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Data dat laad + het opschonen zodat ik het kan gebruiken.
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

    // Unieke waardes voor elk domain.
    //  De domeinen worden gezet met de objecten die ik nodig heb.
    // bv de naam en de variablen uit mijn dataset.
    xBar.domain(data.map(function(d) { return d.Name; }));
    yBar.domain([0, d3.max(data, function(d) { return d.MarketCap; })]);

    // nice rond de getallen netjes af.
    xPN.domain(d3.extent(data, function (d) {return d.Change24h;})).nice();
    yPN.domain(data.map(function (d) {return d.Name;}));

  	xPrice.domain([0, d3.max(data, function(d) { return 3500; })]);
    yPrice.domain(data.map(function(d) { return d.Name; })).padding(0.1);

    // SVG 1 - Price
    // Hier worden de juiste waardes voor de x as met ticks meegeeven.
    gPrice.append("g")
        .attr("fill","white")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + heightTool + ")")
      	.call(d3.axisBottom(xPrice).ticks(5).tickFormat(function(d) {
          return parseInt(d / 1); }).tickSizeInner([-heightTool])
        );

    gPrice.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yPrice));

    // hier worden de bars geladen met de prijs en naam op de horizontale as.
    gPrice.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", yPrice.bandwidth())
        .attr("y", function(d) {
          return yPrice(d.Name);
        })
        .attr("width", function(d) {
          return xPrice(d.Price);
        })
        // De tooltip wordt hier geactiveerd met de juiste data.
        .on("mousemove", function(d){
            tooltipBarTool
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.Name) + "<br>" + "£" + (d.Price));
        })
        // hier verdwijnt de tooltip weer.
    		.on("mouseout", function(d){ tooltipBarTool.style("display", "none");});

      // Hier wordt de 2e svg geactiveerd en kijkt of de waares negatief of positief zijn.
      svgPN.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', function (d) {
          return "bar bar--" + (d.Change24h < 0 ? "negative" : "positive");
        })
        .attr('x', function (d) {
          return xPN(Math.min(0, d.Change24h));
        })
        .attr('y', function (d) {
          return yPN(d.Name);
        })
        .attr('width', function (d) {return Math.abs(xPN(d.Change24h) - xPN(0));})
        // Tooltip stuff netzoals boven is beschreven ^
        .attr('height', 45)
        .on("mousemove", function(d){
            tooltipBarTool
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.Name) + "<br>" + (d.Change24h)+ "%" );
        })
    		.on("mouseout", function(d){ tooltipBarTool.style("display", "none");});


        svgPN.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + heightPN + ')')
          .call(xAxisPN);

        // maakt ticks voor de negative value
        var tickNegative = svgPN.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + xPN(0) + ',0)')
          .call(yAxisPN)
          .selectAll('.tick')
          .filter(function (d, i) {return data[i].Change24h < 0;});

        tickNegative.select('line')
          .attr('x2', 6);

        tickNegative.select('text')
          .attr('x', 19)
          .style('text-anchor', 'start');

        // Maakt een groep aan met een klas aan en een transform
        // de x as wordt op bottom geplaatst
        gBar.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + heightBar + ")")
          .call(d3.axisBottom(xBar));

        // Maakt de y as met ticks aan.
        gBar.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yBar).ticks(10))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        // hier worden de bars geladen met de juiste waardes uit de dataset.
        gBar.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xBar(d.Name); })
            .attr("y", function(d) { return yBar(d.MarketCap); })
            .attr("width", xBar.bandwidth())
            .attr("height", function(d) {
              return heightBar - yBar(d.MarketCap);
            })
            .on("mousemove", function(d){
                tooltipBarTool
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html((d.Name) + "<br>" + "£" + (d.MarketCap));
            })
        		.on("mouseout", function(d){ tooltipBarTool.style("display", "none");});

});
