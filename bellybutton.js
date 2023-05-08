/*
I'm doing this late while following along with Dr. A's Challenge 14 walkthrough video. Sorry, dude.
*/

d3.json("static/samples.json").then(function(data){
    //if the endpoint is accessed, output the data to the console
    console.log(data); // not really necessary, but it was convenient for me to be able to look at it
});

// function to update the demographic info panel with metadata
function demoInfo(sample)
{
    console.log(sample)

    // use d3.json to access the data
    d3.json("samples.json").then((data)=> {
        let demographicInfo = data.metadata;
        
        // filter the metadata. we only want the metadata for the chosen sample number
        let result = demographicInfo.filter(sampleResult => sampleResult.id == sample);
        console.log(result) //this result is an array

        // access the first item in that array
        let resultData = result[0];
        console.log(resultData)

        // pull object key pairs from the resultData object
        // it needs to be cleared every time the sample changes 

        d3.select('#sample-metadata').html(""); // set the metadata to blank text - I had hoped there would be a .clear() function or something.
        Object.entries(resultData).forEach(([key,value]) => {
            //add to the sample # demographic panel.
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`)
        })
    });
}

function buildBubbleChart(sample)
{
    // might as well copy paste the first bits of the bar chart code
    let data = d3.json("samples.json").then((data) => {
        let sampleData = data.samples;
        
        // that's got all the sample data but I only want it for one specific person's id
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // that will also be an array. grab the first entry
        let resultData = result[0];

        // grab the OTU IDs, labels, and sample values
        // those will be necessary for the bar chart
        let OtuIDs = resultData.otu_ids;
        let OtuLabels = resultData.otu_labels;
        let sampleValues = resultData.sample_values;

        let bubbleChart = {
            x: OtuIDs,
            y: sampleValues,
            text: OtuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: OtuIDs, //however it decides to pick its colors
                colorscale: "Earth"
            }
        };

        let layout = {
            title: `Bacteria Cultures for Subject ID No.: ${sample}`,
            hovermode:"closest",
            xaxis: {title:"OTU IDs"}
        };

        Plotly.newPlot("bubble",[bubbleChart],layout)
    });

}

function buildBarChart(sample)
{
    // I might actually know how to do this one.
    // This one needs to grab the info on samples (as in the particular bacteria and their value counts)
    let data = d3.json("samples.json").then((data) => {
        let sampleData = data.samples;
        
        // that's got all the sample data but I only want it for one specific person's id
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // that will also be an array. grab the first entry
        let resultData = result[0]

        // grab the OTU IDs, labels, and sample values
        // those will be necessary for the bar chart
        let OtuIDs = resultData.otu_ids;
        let OtuLabels = resultData.otu_labels;
        let sampleValues = resultData.sample_values;
        // console.log(OtuLabels) I don't want to see this anymore

        // it's time to build the bar chart

        let yticks = OtuIDs.slice(0,10).map(id => `OTU ${id}`); // only the top 10 OTU values get to be in the graph
        let xvalues = sampleValues.slice(0,10);
        let textLabels = OtuLabels.slice(0,10)

        let trace = {
            x: xvalues.reverse(),
            y: yticks.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: `Top 10 Belly Button Bacteria for Subject ID No.: ${sample}`
        };

        Plotly.newPlot("bar",[trace],layout)
    })
}

function dashboard()
{
    // access the dropdown menu selector from the index.html file
    var select = d3.select("#selDataset");

    // This is where you load in data from the json. 
    // I wasn't going to put it in a function originally but I guess this is how it's supposed to go.
    d3.json("samples.json").then((data) => {

        // grab the "names" property out of the data and throw it into an array
        let sampleNames = data.names;
        console.log(sampleNames);

        // add each name in that array as an option for the dropdown menu
        // the dropdown menu options are named selDataset

        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value",sample);
        });

        // when initialized, pass in the first sample info
        let sample1 = sampleNames[0];

        // then call the function to build the demographic info panel for that sample

        demoInfo(sample1);

        // call function to build the bar chart. that function will eventually exist.
        buildBarChart(sample1);

        // call function to build bubble chart. these charts will get written right over if you change test subject IDs.
        buildBubbleChart(sample1);
    });
}


// function to update the dashboard
function optionChanged(item)
{
    // call the update to the metadata/demographic info
    demoInfo(item);

    // call function to build the bar chart. that function will eventually exist.
    buildBarChart(item);

    // call function to build bubble chart
    buildBubbleChart(item);
}

//call the function to initialize the dashboard. I changed 1 name, how original.
// the dashboard function uses the demoInfo function - no need to use demoinfo separately
dashboard();