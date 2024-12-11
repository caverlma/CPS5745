let thresholds = [];
function drawHomerunTable(homeruns, pageSize = 20) {
  const tableDiv = document.getElementById('table_div');
  tableDiv.innerHTML = '';

  const table = document.createElement('table');
  table.id = 'dataTable';
  table.classList.add('display');
  table.style.width = '100%';
  tableDiv.appendChild(table);

  const headers = [
      { display: 'Record ID', key: 'Record_ID' },
      { display: 'Game Date', key: 'Game_Date' },
      { display: 'Batter', key: 'Batter' },
      { display: 'Batting Team', key: 'Batter_Team' },
      { display: 'Pitcher', key: 'Pitcher' },
      { display: 'Pitching Team', key: 'Pitcher_Team' },
      { display: 'Inning', key: 'Inning' },
      { display: 'Distance', key: 'Distance' },
      { display: 'Exit Velocity', key: 'Exit_Velocity' },
      { display: 'Elevation Angle', key: 'Elevation_Angle' },
      { display: 'Horizontal Angle', key: 'Horizontal_Angle' },
      { display: 'Apex', key: 'Apex' },
      { display: 'Ballpark', key: 'Ballpark' }
  ];

  const AllHomeruns = homeruns.map(hr => hr.Distance);
  const sortedDistances = AllHomeruns.sort((a, b) => a - b);
  const q1 = sortedDistances[Math.floor((sortedDistances.length / 4))];
  const q3 = sortedDistances[Math.floor((sortedDistances.length * 3) / 4)];
  thresholds = [q1, q3];

  $('#dataTable').DataTable({
      destroy: true,
      data: homeruns,
      columns: headers.map(header => ({
          title: header.display,
          data: header.key
      })),
      rowCallback: function (row, data) {
              if (data.Distance < thresholds[0] || data.Distance > thresholds[1]) {
                  $(row).css('background-color', '#ffff71');
                  $(row).css('color', '#8b0000');
              }
      },
      deferRender: true,
      pageLength: pageSize,
      responsive: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf'],
      paging: true,
      lengthChange: true,
      searching: true,
      order: [[0, 'asc']]
  });
}

function drawStockPricesTable(stockPrices, pageSize = 20) {
  console.log("Rendering Stock Prices DataTable with page size:", pageSize);

  const tableDiv = document.getElementById('table_div');
  tableDiv.innerHTML = '';

  // Create table
  const table = document.createElement('table');
  table.id = 'dataTable';
  table.classList.add('display');
  table.style.width = '100%';
  tableDiv.appendChild(table);

  const headers = [
      { display: 'ID', key: 'id' },
      { display: 'Symbol', key: 'symbol' },
      { display: 'Date', key: 'date' },
      { display: 'Open', key: 'open' },
      { display: 'High', key: 'high' },
      { display: 'Low', key: 'low' },
      { display: 'Close', key: 'close' },
      { display: 'Volume', key: 'volume' },
      { display: 'Adjusted Close', key: 'adj_close' }
  ];

  // Step 1: Group percent changes by stock symbol
  const percentChangesBySymbol = {};
  stockPrices.forEach(stock => {
      if (stock.open > 0) { // Avoid division by zero
          const percentChange = Math.abs((stock.close - stock.open) / stock.open) * 100;
          if (!percentChangesBySymbol[stock.symbol]) {
              percentChangesBySymbol[stock.symbol] = [];
          }
          percentChangesBySymbol[stock.symbol].push(percentChange);
      }
  });

  // Step 2: Calculate IQR and outlier threshold for each stock symbol
  thresholdsBySymbol = {}; // Update the global variable
  for (const [symbol, percentChanges] of Object.entries(percentChangesBySymbol)) {
      const sortedChanges = percentChanges.sort((a, b) => a - b);
      const q1 = sortedChanges[Math.floor((sortedChanges.length / 4))];
      const q3 = sortedChanges[Math.floor((sortedChanges.length * 3) / 4)];
      const iqr = q3 - q1;
      const outlierThreshold = q3 + 1.5 * iqr;
      thresholdsBySymbol[symbol] = outlierThreshold;
  }

  console.log('Outlier thresholds by symbol:', thresholdsBySymbol);

  // Step 3: Highlight rows with percent changes > outlierThreshold for the specific stock symbol
  $('#dataTable').DataTable({
      destroy: true,
      data: stockPrices,
      columns: headers.map(header => ({
          title: header.display,
          data: header.key
      })),
      rowCallback: function (row, data) {
          if (data.open > 0) { // Avoid division by zero
              const percentChange = Math.abs((data.close - data.open) / data.open) * 100;
              const threshold = thresholdsBySymbol[data.symbol];
              if (percentChange > threshold) {
                  // Add custom styling for outlier rows
                  $(row).css('background-color', '#ffff71');  // Light yellow background
                  $(row).css('color', '#8b0000');             // Dark red text
              }
          }
      },
      deferRender: true,
      pageLength: pageSize,
      responsive: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf'],
      paging: true,
      lengthChange: true,
      searching: true,
      order: [[0, 'asc']]
  });
}

function drawPerTeamTable(response) {
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(function() {
      const googleData = new google.visualization.DataTable();
      googleData.addColumn('string', 'Batter_Team');
      googleData.addColumn('number', 'Homerun_Count');

      const minYear = response.min_year;
      const maxYear = response.max_year;
      response.data.forEach(tms => {
          googleData.addRow([
              tms.Batter_Team,
              tms.Homerun_Count
          ]);
      });

      const options = {
          title: `Homeruns By Team (${minYear} - ${maxYear})`,
          width: '100%',
          height: 'auto',
          legend: { position: 'none' }
      };

      document.getElementById("graph_div").innerHTML = "";
      const chart = new google.visualization.ColumnChart(document.getElementById('graph_div'));
      chart.draw(googleData, options);
  });
}


function drawPerPlayerTable(players) {
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() {
        const googleData = new google.visualization.DataTable();
        googleData.addColumn('string', 'Batter');
        googleData.addColumn('number', 'Homerun_Count');

        players.forEach(pls => {
            googleData.addRow([
                pls.Batter,
                pls.Homerun_Count
            ]);
        });

        const options = {
            title: 'Homeruns By Player',
            width: '100%',
            height: 'auto',
            legend: { position: 'none' }
        };
        document.getElementById("graph_div").innerHTML = "";
        const chart = new google.visualization.ColumnChart(document.getElementById('graph_div'));
        chart.draw(googleData, options);
    });
}

function drawPerYearTable(monthruns) {
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() {
        const googleData = new google.visualization.DataTable();
        googleData.addColumn('number', 'Month');
        googleData.addColumn('number', 'Homerun_Count');

        monthruns.forEach(mths => {
            googleData.addRow([
                mths.Month,
                mths.Homerun_Count
            ]);
        });

        // Define and draw the chart
        const options = {
            title: 'Homeruns By Team Per Year',
            width: '100%',
            height: 'auto',
            hAxis: {title: 'Month', minValue: 0, maxValue: 12},
            vAxis: {title: 'Number of Homeruns'},
            legend: { position: 'none' }
        };
        document.getElementById("graph_div").innerHTML = "";
        const chart = new google.visualization.LineChart(document.getElementById('graph_div'));
        chart.draw(googleData, options);
    });
}

function drawPerMonthTable(dayruns) {
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() {
        const googleData = new google.visualization.DataTable();
        googleData.addColumn('number', 'Day');
        googleData.addColumn('number', 'Homerun_Count');
        dayruns.forEach(mths => {
            googleData.addRow([
                mths.Day,
                mths.Homerun_Count
            ]);
        });

        // Define and draw the chart
        const options = {
            title: 'Homeruns By Team Per Month',
            width: '100%',
            height: 'auto',
            legend: { position: 'none' }
        };
        document.getElementById("graph_div").innerHTML = "";
        const chart = new google.visualization.LineChart(document.getElementById('graph_div'));
        chart.draw(googleData, options);
    });
}

function drawCorrelationTable(correlations) {
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(function() {
      const googleData = new google.visualization.DataTable();
      googleData.addColumn('number', 'Exit_Velocity');
      googleData.addColumn('number', 'Distance');
      correlations.forEach(cor => {
          googleData.addRow([
            cor.Exit_Velocity,
            cor.Distance
          ]);
      });

      // Define and draw the chart
      const options = {
          title: 'Exit Velocity vs. Total Distance Traveled',
          width: '100%',
          height: 'auto',
          legend: { position: 'none' },
          trendlines: { 0: {} }
      };
      document.getElementById("graph_div").innerHTML = "";
      const chart = new google.visualization.ScatterChart(document.getElementById('graph_div'));
      chart.draw(googleData, options);
  });
}

let LoggedIn = false;
let DataLoaded = false;
let username = "";
let password = "";
let uname, ulog, uid, ugender;
$("#loginInfo").on('click', function() {alert("Account Info\n\nName: " + uname + "\nUID: " + uid + "\nLogin: " + ulog + "\nGender: " + ugender);});
$("#devInfo").on('click', function() {alert("Developer Info\n\nName: Max Caverly\nClass ID: CPS*5745*02\nProject Date (Part 1): 10/23/2024");});
$("#clientInfo").on('click', function() {alert("Client Info\n\nBrowser: " + navigator.appName + " " + navigator.appVersion + "\nOperating System: " + navigator.platform);});

window.onload = function() {
  fetch('login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status == 'already_logged_in') {
      LoggedIn = true;
      document.getElementById("message_div").innerHTML = data.message;
      uname = data.name;
      ulog = data.login;
      uid = data.uid;
      ugender = data.gender;
    }
  });
};


function LoginDB() {
  console.log("You are doing a thing!");
  const username = document.getElementById("THEusername").value;
  const password = document.getElementById("THEpassword").value;

  if (username && password) {
    modal.style.display = "none";
    fetch('login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
      if (data.status == 'already_logged_in') {
        LoggedIn = true;
        alert(data.message);
      }
      else if (data.status == 'login_failure') {
        alert(data.message);
      }
      else if (data.status == 'logging_in') {
        LoggedIn = true;
        document.getElementById("message_div").innerHTML = data.message;
        uname = data.name;
        ulog = data.login;
        uid = data.uid;
        ugender = data.gender;
      }
    });
  }
}

function LoadTable(){
  if (!LoggedIn) {alert("Please log in to load dataset."); return;}
    fetch('gatherTableData.php')
    .then(response => response.json())
      .then(data => {
          drawHomerunTable(data);
          document.getElementById('message_div').innerHTML += '<p>Homeruns table successfully loaded. Distance thresholds are (' + thresholds[0] + ', ' + thresholds[1] + ').</p>';
          DataLoaded = true;
          DataLoaded2 = false;

          document.getElementById("table_message").innerHTML = "";
          const TableperPlayersOption = document.createElement('select');
          TableperPlayersOption.id = 'TableperPlayers';
          TableperPlayersOption.name = 'TabledataOption';

          const options = ["ALL", "ARI", "ATL", "BAL", "BOS", "CHC", "CHW", "CIN", "CLE", "COL", "DET", "FLA", "HOU", "KC", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "STL", "TB", "TEX", "TOR", "WSH"];
          options.forEach(optionValue => {
              const option = document.createElement('option');
              option.value = optionValue;
              option.text = optionValue;
              TableperPlayersOption.appendChild(option);
          });

          const TableperPlayersLabel = document.createElement('label');
          TableperPlayersLabel.htmlFor = 'TableperPlayers';
          TableperPlayersLabel.innerHTML = 'Select Team: ';

          table_message.appendChild(TableperPlayersLabel);
          table_message.appendChild(TableperPlayersOption);

          TableperPlayersOption.addEventListener('change', function(){
            fetch('gatherTableData.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `team=${encodeURIComponent(TableperPlayersOption.value)}`
          })
            .then(response => response.json())
            .then(data => {
                drawHomerunTable(data);
            })
            .catch(error => {
                console.error('Error loading table:', error);
                document.getElementById('table_message').innerHTML = '<p>Error loading table data.</p>';
            });
          });
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('table_message').innerHTML = '<p>Error loading table data.</p>';
      });
}

function LoadTable2(){
  if (!LoggedIn) {alert("Please log in to load dataset."); return;}
    fetch('gatherTable2Data.php')
    .then(response => response.json())
      .then(data => {
          drawStockPricesTable(data);
          document.getElementById('message_div').innerHTML += '<p>Stock prices table successfully loaded.</p>';
          document.getElementById('table_message').innerHTML = '';
          document.getElementById("selection_div").innerHTML = "";
          document.getElementById("selection2_div").innerHTML = "";
          DataLoaded = false;
          DataLoaded2 = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('table_message').innerHTML = '<p>Error loading table data.</p>';
      });
}

function BarChartRadio(){
  if (DataLoaded2) {alert("Please load the correct database before interacting with the charts."); return;}
  if (!DataLoaded && !DataLoaded2) {alert("Please load the database before interacting with the charts."); return;}
  document.getElementById("selection_div").innerHTML = "";
  document.getElementById("selection2_div").innerHTML = "";
  if (!document.getElementById('perTeam')) {
    const perTeamOption = document.createElement('input');
    perTeamOption.type = 'radio';
    perTeamOption.id = 'perTeam';
    perTeamOption.name = 'dataOption';
    perTeamOption.value = 'perTeam';

    const perTeamLabel = document.createElement('label');
    perTeamLabel.htmlFor = 'perTeam';
    perTeamLabel.innerHTML = 'Homeruns Per Team<br><br>';

    selection_div.appendChild(perTeamOption);
    selection_div.appendChild(perTeamLabel);
  }
  if (!document.getElementById('perPlayer')) {
    const perPlayerOption = document.createElement('input');
    perPlayerOption.type = 'radio';
    perPlayerOption.id = 'perPlayer';
    perPlayerOption.name = 'dataOption';
    perPlayerOption.value = 'perPlayer';

    const perPlayerLabel = document.createElement('label');
    perPlayerLabel.htmlFor = 'perPlayer';
    perPlayerLabel.innerHTML = 'Homeruns Per Player Per Team<br><br>';

    selection_div.appendChild(perPlayerOption);
    selection_div.appendChild(perPlayerLabel);
  }

}

function LineChartRadio(){
  if (!DataLoaded) {alert("Please load the database before interacting with the charts."); return;}
  document.getElementById("selection_div").innerHTML = "";
  if (!document.getElementById('perMonth')) {
    document.getElementById("selection2_div").innerHTML = "";
    const perMonthOption = document.createElement('input');
    perMonthOption.type = 'radio';
    perMonthOption.id = 'perMonth';
    perMonthOption.name = 'dataOption';
    perMonthOption.value = 'perMonth';

    const perMonthLabel = document.createElement('label');
    perMonthLabel.htmlFor = 'perMonth';
    perMonthLabel.innerHTML = 'Monthly Homeruns Per Team<br><br>';

    selection_div.appendChild(perMonthOption);
    selection_div.appendChild(perMonthLabel);
  }
  if (!document.getElementById('perYear')) {
    document.getElementById("selection2_div").innerHTML = "";
    const perYearOption = document.createElement('input');
    perYearOption.type = 'radio';
    perYearOption.id = 'perYear';
    perYearOption.name = 'dataOption';
    perYearOption.value = 'perYear';

    const perYearLabel = document.createElement('label');
    perYearLabel.htmlFor = 'perYear';
    perYearLabel.innerHTML = 'Yearly Homeruns Per Team<br><br>';

    selection_div.appendChild(perYearOption);
    selection_div.appendChild(perYearLabel);
  }
  if (!document.getElementById('correlation')) {
    document.getElementById("selection2_div").innerHTML = "";
    const correlationOption = document.createElement('input');
    correlationOption.type = 'radio';
    correlationOption.id = 'correlation';
    correlationOption.name = 'dataOption';
    correlationOption.value = 'correlation';

    const correlationLabel = document.createElement('label');
    correlationLabel.htmlFor = 'correlation';
    correlationLabel.innerHTML = 'Exit Velocity vs. Distance<br><br>';

    selection_div.appendChild(correlationOption);
    selection_div.appendChild(correlationLabel);
  }
}

function drawSlider() {
  if (!document.getElementById('slider-range')) {
    document.getElementById('graph_div').innerHTML += '<label for="amount">Year range:</label>';
    document.getElementById('graph_div').innerHTML += '<input type="text" id="amount" readonly="" style="border:0; text-align: center;">';
    document.getElementById('graph_div').innerHTML += '<br><div id="slider-range"></div>';
    document.getElementById('graph_div').innerHTML += '<button id="submit-button">Submit</button>';
    document.getElementById('graph_div').innerHTML += '<button id="save-button">Save Options</button>';

    document.getElementById("graph_div").style.display = "flex";
    document.getElementById("graph_div").style.flexDirection = "column";
    document.getElementById("graph_div").style.alignItems = "center";
    document.getElementById("graph_div").style.justifyContent = "center";
    document.getElementById("slider-range").style.width = "300px";

    $(document).ready(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 2006,
        max: 2017,
        values: [ 2006, 2017 ],
        slide: function( event, ui ) {
          $( "#amount" ).val( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
      });
      $( "#amount" ).val( "" + $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );
    });
  }

  document.getElementById('submit-button').addEventListener('click', function() {
    var minYear = $("#slider-range").slider("values", 0);
    var maxYear = $("#slider-range").slider("values", 1);

    fetch('perTeam.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `min=${encodeURIComponent(minYear)}&max=${encodeURIComponent(maxYear)}`
    })
    .then(response => response.json())
    .then(data => {
      drawPerTeamTable(data);
      setTimeout(function() {drawSlider();}, 200);
    })
    .catch(error => {
      console.error('Error loading table:', error);
      document.getElementById('table_message').innerHTML = '<p>Error loading table data.</p>';
    });
  });

  document.getElementById('save-button').addEventListener('click', function() {
    var minYear = $("#slider-range").slider("values", 0);
    var maxYear = $("#slider-range").slider("values", 1);

    fetch('saveOptions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `min=${encodeURIComponent(minYear)}&max=${encodeURIComponent(maxYear)}&uid=${encodeURIComponent(uid)}&login=${encodeURIComponent(ulog)}`
    })
    .then(response => response.json())
    .then(data => {
      {alert(data.message); return;}
    })
    .catch(error => {
      console.error('Error saving settings:', error);
      document.getElementById('table_message').innerHTML = '<p>Error saving settings!</p>';
    });
  });
}


$(document).on('change', '[type="radio"]', function() {
  var currentRadio = $(this).val(); // Get the radio checked value
  
  if (currentRadio == 'perTeam'){
    fetch('perTeam.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `uid=${encodeURIComponent(uid)}`
    })
    .then(response => response.json())
      .then(data => {
          drawPerTeamTable(data);
          document.getElementById('message_div').innerHTML += '<p>Per Team Graph successfully loaded.</p>';
          DataLoaded = true;
          setTimeout(function() {drawSlider();}, 200);
      })

      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('graph_div').innerHTML = '<p>Error loading graph.</p>';
      });
  }
  else if (currentRadio == 'perPlayer'){
    if (!document.getElementById('perPlayers')) {
    document.getElementById("selection2_div").innerHTML = "";
    const perPlayersOption = document.createElement('select');
    perPlayersOption.id = 'perPlayers';
    perPlayersOption.name = 'dataOption';

    const options = ["ARI", "ATL", "BAL", "BOS", "CHC", "CHW", "CIN", "CLE", "COL", "DET", "FLA", "HOU", "KC", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "STL", "TB", "TEX", "TOR", "WSH"];
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
        perPlayersOption.appendChild(option);
    });

    const perPlayersLabel = document.createElement('label');
    perPlayersLabel.htmlFor = 'perPlayers';
    perPlayersLabel.innerHTML = 'Select Team:';

    selection2_div.appendChild(perPlayersLabel);
    selection2_div.appendChild(perPlayersOption);

    perPlayersOption.addEventListener('change', function(){
      fetch('getPlayers.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `team=${encodeURIComponent(perPlayersOption.value)}`
    })
      .then(response => response.json())
      .then(data => {
          drawPerPlayerTable(data);
          document.getElementById('message_div').innerHTML += '<p>Per Player Graph successfully loaded.</p>';
          DataLoaded = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('graph_div').innerHTML = '<p>Error loading graph.</p>';
      });
    });
    }
  }
  else if (currentRadio == 'perMonth'){
    if (!document.getElementById('perMonths')) {
      document.getElementById("selection2_div").innerHTML = "";
      const perMonthsOption = document.createElement('select');
      perMonthsOption.id = 'perMonths';
    perMonthsOption.name = 'dataOption';

    const options1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    options1.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
        perMonthsOption.appendChild(option);
    });

    const perMonthsLabel = document.createElement('label');
    perMonthsLabel.htmlFor = 'perMonths';
    perMonthsLabel.innerHTML = '<br>Select Month:';

    selection2_div.appendChild(perMonthsLabel);
    selection2_div.appendChild(perMonthsOption);

    const perYearsOption = document.createElement('select');
    perYearsOption.id = 'perYears1';
    perYearsOption.name = 'dataOption';

    const options2 = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"];
    options2.forEach(optionValue => {
        const option1 = document.createElement('option');
        option1.value = optionValue;
        option1.text = optionValue;
        perYearsOption.appendChild(option1);
    });

    const perYearsLabel = document.createElement('label');
    perYearsLabel.htmlFor = 'perYears1';
    perYearsLabel.innerHTML = '<br>Select Year:';

    selection2_div.appendChild(perYearsLabel);
    selection2_div.appendChild(perYearsOption);

    const perPlayersOption = document.createElement('select');
    perPlayersOption.id = 'perPlayers';
    perPlayersOption.name = 'dataOption';

    const options3 = ["ARI", "ATL", "BAL", "BOS", "CHC", "CHW", "CIN", "CLE", "COL", "DET", "FLA", "HOU", "KC", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "STL", "TB", "TEX", "TOR", "WSH"];
    options3.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
        perPlayersOption.appendChild(option);
    });

    const perPlayersLabel = document.createElement('label');
    perPlayersLabel.htmlFor = 'perPlayers';
    perPlayersLabel.innerHTML = '<br>Select Team:';

    selection2_div.appendChild(perPlayersLabel);
    selection2_div.appendChild(perPlayersOption);

    perMonthsOption.addEventListener('change', MonthsTable);
    perYearsOption.addEventListener('change', MonthsTable);
    perPlayersOption.addEventListener('change', MonthsTable);

    function MonthsTable() {
      fetch('perMonth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `team=${encodeURIComponent(perPlayersOption.value)}&year=${encodeURIComponent(perYearsOption.value)}&month=${encodeURIComponent(perMonthsOption.value)}`
    })
      .then(response => response.json())
      .then(data => {
          drawPerMonthTable(data);
          document.getElementById('message_div').innerHTML += '<p>Per Month Graph successfully loaded.</p>';
          DataLoaded = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('graph_div').innerHTML += '<p>Error loading graph.</p>';
      });
    }

    }
  }
  else if (currentRadio == 'perYear'){
    if (!document.getElementById('perYears2')) {
      document.getElementById("selection2_div").innerHTML = "";
    const perYearsOption = document.createElement('select');
    perYearsOption.id = 'perYears';
    perYearsOption.name = 'dataOption';

    const options1 = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"];
    options1.forEach(optionValue => {
        const option1 = document.createElement('option');
        option1.value = optionValue;
        option1.text = optionValue;
        perYearsOption.appendChild(option1);
    });

    const perYearsLabel = document.createElement('label');
    perYearsLabel.htmlFor = 'perYears2';
    perYearsLabel.innerHTML = 'Select Year:';

    selection2_div.appendChild(perYearsLabel);
    selection2_div.appendChild(perYearsOption);

    const perPlayersOption = document.createElement('select');
    perPlayersOption.id = 'perPlayers';
    perPlayersOption.name = 'dataOption';

    const options2 = ["ARI", "ATL", "BAL", "BOS", "CHC", "CHW", "CIN", "CLE", "COL", "DET", "FLA", "HOU", "KC", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "STL", "TB", "TEX", "TOR", "WSH"];
    options2.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.text = optionValue;
        perPlayersOption.appendChild(option);
    });

    const perPlayersLabel = document.createElement('label');
    perPlayersLabel.htmlFor = 'perPlayers';
    perPlayersLabel.innerHTML = '<br>Select Team:';

    selection2_div.appendChild(perPlayersLabel);
    selection2_div.appendChild(perPlayersOption);

    perYearsOption.addEventListener('change', YearsTable);
    perPlayersOption.addEventListener('change', YearsTable);

    function YearsTable() {
      fetch('perYear.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `team=${encodeURIComponent(perPlayersOption.value)}&year=${encodeURIComponent(perYearsOption.value)}`
    })
      .then(response => response.json())
      .then(data => {
          drawPerYearTable(data);
          document.getElementById('message_div').innerHTML += '<p>Per Year Graph successfully loaded.</p>';
          DataLoaded = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('graph_div').innerHTML += '<p>Error loading graph.</p>';
      });
    }

    }
  }

  if (currentRadio == 'correlation'){
    fetch('correlation.php')
    .then(response => response.json())
      .then(data => {
          drawCorrelationTable(data);
          document.getElementById('message_div').innerHTML += '<p>Exit Velocity vs. Distance Graph successfully loaded.</p>';
          DataLoaded = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('graph_div').innerHTML = '<p>Error loading graph.</p>';
      });
  }
  
});


function LogoutDB() {
  fetch('logout.php')
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              document.getElementById("selection_div").innerHTML = "";
              document.getElementById("selection2_div").innerHTML = "";
              document.getElementById("message_div").innerHTML = "";
              document.getElementById("graph_div").innerHTML = "";
              document.getElementById("table_message").innerHTML = "";
              document.getElementById("table_div").innerHTML = "";
              LoggedIn = false;
              DataLoaded = false;
              DataLoaded2 = false;
              alert(data.message);
          } else if (data.status === 'error') { alert(data.message); }
      })
      .catch(error => {console.error('Error during logout:', error);});
}

function ExitPage() {
window.open("about:blank", "_self");
}


// Get the modal
var modal = document.getElementById("myModal");
// Get the link that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the link, open the modal 
btn.onclick = function(event) {
event.preventDefault(); // Prevent the default anchor behavior
modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = "none";
}
}