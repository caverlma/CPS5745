function drawHomerunTable(homeruns) {
    google.charts.load('current', {'packages': ['table']});
    google.charts.setOnLoadCallback(function() {
        const googleData = new google.visualization.DataTable();
        googleData.addColumn('number', 'Record_ID');
        googleData.addColumn('string', 'Game_Date');
        googleData.addColumn('string', 'Batter');
        googleData.addColumn('string', 'Batter_Team');
        googleData.addColumn('string', 'Pitcher');
        googleData.addColumn('string', 'Pitcher_Team');
        googleData.addColumn('number', 'Inning');
        googleData.addColumn('number', 'Distance');
        googleData.addColumn('number', 'Exit_Velocity');
        googleData.addColumn('number', 'Elevation_Angle');
        googleData.addColumn('number', 'Horizontal_Angle');
        googleData.addColumn('number', 'Apex');
        googleData.addColumn('string', 'Ballpark');
        
        homeruns.forEach(hr => {
            googleData.addRow([
                hr.Record_ID,
                hr.Game_Date,
                hr.Batter,
                hr.Batter_Team,
                hr.Pitcher,
                hr.Pitcher_Team,
                hr.Inning,
                hr.Distance,
                hr.Exit_Velocity,
                hr.Elevation_Angle,
                hr.Horizontal_Angle, 
                hr.Apex,
                hr.Ballpark
            ]);
        });

        const table = new google.visualization.Table(document.getElementById('table_div'));
        table.draw(googleData, {
            showRowNumber: true,
            width: '100%',
            height: 'auto',
            page: 'enable',
            pageSize: 20
        });
    });
}

function drawPerTeamTable(teams) {
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(function() {
        const googleData = new google.visualization.DataTable();
        googleData.addColumn('string', 'Batter_Team');
        googleData.addColumn('number', 'Homerun_Count');

        teams.forEach(tms => {
            googleData.addRow([
                tms.Batter_Team,
                tms.Homerun_Count
            ]);
        });

        // Define and draw the chart
        const options = {
            title: 'Homeruns By Team',
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

        // Define and draw the chart
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

let LoggedIn = false;
let DataLoaded = false;
let username = "";
let password = "";
let uname = "";
let ulog = "";
let uid = "";
let ugender = "";
$("#loginInfo").on('click', function() {alert("Account Info\n\nName: " + uname + "\nUID: " + uid + "\nLogin: " + ulog + "\nGender: " + ugender);});
$("#devInfo").on('click', function() {alert("Developer Info\n\nName: Max Caverly\nClass ID: CPS*5745*02\nProject Date (Part 1): 10/23/2024");});
$("#clientInfo").on('click', function() {alert("Client Info\n\nBrowser: " + navigator.appName + " " + navigator.appVersion + "\nOperating System: " + navigator.platform);});

function LoginDB(){
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
        if (data.status == 'already_logged_in') {LoggedIn = true; alert(data.message);}
        else if (data.status == 'login_failure') {alert(data.message);}
        else if (data.status == 'logging_in'){
          LoggedIn = true;
          document.getElementById("message_div").innerHTML = data.message;
          uname = data.name;
          ulog = data.login;
          uid = data.uid;
          ugender = data.gender;
        }
      })
  }
}

function LoadTable(){
  if (!LoggedIn) {alert("Please log in to load dataset."); return;}
    fetch('gatherTableData.php')
    .then(response => response.json())
      .then(data => {
          drawHomerunTable(data);
          document.getElementById('message_div').innerHTML += '<p>Homeruns table successfully loaded.</p>';
          DataLoaded = true;
      })
      .catch(error => {
          console.error('Error loading table:', error);
          document.getElementById('table_message').innerHTML = '<p>Error loading table data.</p>';
      });
}

function BarChartRadio(){
  if (!DataLoaded) {alert("Please load the database before interacting with the charts."); return;}
  document.getElementById("selection_div").innerHTML = "";
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
}

$(document).on('change', '[type="radio"]', function() {
  var currentRadio = $(this).val(); // Get the radio checked value
  
  if (currentRadio == 'perTeam'){
    fetch('perTeam.php')
    .then(response => response.json())
      .then(data => {
          drawPerTeamTable(data);
          document.getElementById('message_div').innerHTML += '<p>Per Team Graph successfully loaded.</p>';
          DataLoaded = true;
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