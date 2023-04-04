//store the url in a constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//initial function that display, the default 
function init() {

    // dropdown menu to select element
    let dropdownMenu = d3.select("#selDataset");

    // add and popluate samples to dropdown menu
    d3.json(url).then((data) => {
        let sampleNames = data.names;
        sampleNames.forEach((name) => {
            dropdownMenu.append("option")
            .text(name)
            .property("value",name);
        });

        // first item on the list 
        let first = sampleNames[0];

        // display the defualt plots
        metaData(first);
        barChart(first);
        bubbleChart(first);
    });
};

function optionChanged(newSamp) {
    // get the new sample information 
    metaData(newSamp);
    barChart(newSamp);
    bubbleChart(newSamp);
  }

//function to display the demongraphics of each key and value for the matadata 
function metaData(sample) {
    d3.json(url).then((data) => {
        let meta = data.metadata;

        let sampleFilter = meta.filter(obj => obj.id == sample);

        // get the first item
        let samp = sampleFilter[0];

        // make sure it is empty 
        d3.select(".panel-body").html("");

        // Use Object.entries to add the key and value 
        Object.entries(samp).forEach(([key,value]) => {
            d3.select(".panel-body").append("h6").text(`${key}: ${value}`);
        });
    });

};

// function to create and display the bar chart
function barChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;

        // filter based on the value of the sample
        let sampleFilter = samples.filter(obj => obj.id == sample);

        // first item 
        let samp = sampleFilter[0];
        
        // trace top 10 items for bar chart
        let trace = {
            x: samp.sample_values.slice(0,10).reverse(),
            y: samp.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: samp.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        traceBar = [trace]

        // plot the bar chart
        Plotly.newPlot("bar", traceBar)
    });
};

function bubbleChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;

        // filter based on the value of the sample
        let sampleFilter = samples.filter(obj => obj.id == sample);

        // first item 
        let samp = sampleFilter[0];
        
        // trace top 10 items for bubble chart
        let trace = {
            x: samp.otu_ids,
            y: samp.sample_values,
            text: samp.otu_labels,
            mode: "markers",
            marker: {
                size: samp.sample_values,
                color: samp.otu_ids,
            }
        };

        traceBubble = [trace]
        // plot the bubble chart
        Plotly.newPlot("bubble", traceBubble)
    });
};

init();