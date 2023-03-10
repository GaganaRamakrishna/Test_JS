looker.plugins.visualizations.add({
    // Id and Label are legacy properties that no longer have any function besides documenting
    // what the visualization used to have. The properties are now set via the manifest
    // form within the admin/visualizations page of Looker
    id: "looker_table",
    label: "Table",
    options: {
      font_size: {
        type: "number",
        label: "Font Size (px)",
        default: 11
      }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {
      console.log(config);
      // Insert a <style> tag with some styles we'll use later.
      element.innerHTML = `
        <style>
          .table {
            font-size: ${config.font_size}px;
            border: 1px solid black;
            border-collapse: collapse;
          }
          .table-header {
            background-color: #eee;
            border: 1px solid black;
            border-collapse: collapse;
            font-weight: normal;
          }
          .table-cell {
            padding: 5px;
            border-bottom: 1px solid #ccc;
            border: 1px solid black;
            border-collapse: collapse;
          }
        </style>
      `;
       // Create a container element to let us center the text.
    this._container = element.appendChild(document.createElement("div"));

},
 // Render in response to the data or settings changing
 updateAsync: function (data, element, config, queryResponse, details, done) {
    console.log(config);
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({ title: "No Dimensions", message: "This chart requires dimensions." });
      return;
    }

    /* Code to generate table
     * In keeping with the spirit of this little visualization plugin,
     * it's done in a quick and dirty way: piece together HTML strings.
     */
    var generatedHTML = `
      <style>
        .table {
          font-size: ${config.font_size}px;
          border: 1px solid black;
          border-collapse: collapse;
        }
        .table-header {
          background-color: #eee;
          border: 1px solid black;
          border-collapse: collapse;
          font-weight: normal;
        }
    .table-cell {
      padding: 5px;
      border-bottom: 1px solid #ccc;
      border: 1px solid black;
      border-collapse: collapse;
    }
     .table-row {
      border: 1px solid black;
      border-collapse: collapse;
    }
  </style>
`;
generatedHTML += "<table class='table'>";
generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header' rowspan='2' colspan='2' > </th>`;
generatedHTML += `<th class='table-header' rowspan='1'>Applicable limit</th>`;
generatedHTML += "</tr>";

generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header'> 010 </th>`;
generatedHTML += "</tr>";

generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header'> 010 </th>`;
generatedHTML += `<th class='table-header'> Non institutions </th>`;
generatedHTML += "</tr>";

generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header'> 020 </th>`;
generatedHTML += `<th class='table-header'> Institutions </th>`;
generatedHTML += "</tr>";

generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header'> 030 </th>`;
generatedHTML += `<th class='table-header'> Institutions in % </th>`;
generatedHTML += "</tr>";

generatedHTML += "<tr class='table-header'>";
generatedHTML += `<th class='table-header'> 040 </th>`;
generatedHTML += `<th class='table-header'> Globally Systemic Important Institutions (G-SIIs) </th>`;
generatedHTML += "</tr>";

   // First row is the header
   generatedHTML += "<tr class='table-header'>";
   for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
     generatedHTML += `<th class='table-header'>${field.label_short}</th>`;
   }
   generatedHTML += "</tr>";

   // Next rows are the data
   for (row of data) {
    generatedHTML += "<tr class='table-row'>";
    for (field of queryResponse.fields.dimensions.concat(queryResponse.fields.measures)) {
      generatedHTML += `<td class='table-cell'>${LookerCharts.Utils.htmlForCell(row[field.name])}</td>`;
    }
    generatedHTML += "</tr>";
  }
  generatedHTML += "</table>";

  this._container.innerHTML = generatedHTML;

  done();
}
});
