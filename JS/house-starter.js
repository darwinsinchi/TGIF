//var houseMembers = hdata.results[0].members;

var houseMembers;
//
var congress;
if (window.location.href.includes("senate")) {
  congress = "senate";
} else {
  congress = "house";
}

fetch(
  "https://api.propublica.org/congress/v1/113/" + congress + "/members.json",
  {
    method: "GET",
    headers: {
      "X-API-KEY": "UtUCd2v2fjbIMNqQxZaAeVS407ZAVVT9iKsCJO6r"
    }
  }
)
  .then(function(response) {
    console.log(response);
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(function(json) {
    console.log(json.results[0].members);
    houseMembers = json.results[0].members;
    //
    houseTable(houseMembers);
    RDIfilter(houseMembers);
    filterStep(houseMembers);
  })
  .catch(function(error) {
    console.log("Request failed:" + error.message);
  });

//Creating the first table
function houseTable(hm) {
  var attach = document.getElementById("tbody-house-data");
  for (i = 0; i < hm.length; i++) {
    var tRow = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdParty = document.createElement("td");
    var tdState = document.createElement("td");
    var tdSenior = document.createElement("td");
    var tdPercentageVotes = document.createElement("td");

    attach.append(tRow);
    tRow.append(tdName);
    tRow.append(tdParty);
    tRow.append(tdState);
    tRow.append(tdSenior);
    tRow.append(tdPercentageVotes);

    //This connects the hyperlink to the name
    var textlink = document.createElement("a");
    textlink.setAttribute("href", hm[i].url);

    //This combines the first, middle, and last name
    textlink.innerHTML =
      hm[i].first_name + " " + hm[i].middle_name + " " + hm[i].last_name;
    if (hm[i].middle_name == null) {
      textlink.innerHTML = hm[i].first_name + " " + hm[i].last_name;
    }
    tdName.append(textlink);
    tdParty.innerHTML = hm[i].party;
    tdState.innerHTML = hm[i].state;
    tdSenior.innerHTML = hm[i].seniority;
    tdPercentageVotes.innerHTML = hm[i].votes_with_party_pct + "%";
  }
}
//houseTable(houseMembers);

//Creating a filter for Republicans, Democrats, and Independents
var arrayR = [];
var arrayD = [];
var arrayI = [];

function RDIfilter(hm) {
  for (var i = 0; i < hm.length; i++) {
    if (hm[i].party == "R") {
      arrayR.push(hm[i]);
    } else if (hm[i].party == "D") {
      arrayD.push(hm[i]);
    } else if (hm[i].party == "I") {
      arrayI.push(hm[i]);
    }
  }
}
// RDIfilter(houseMembers);

//Getting checked boxes to work
function clearEverything() {
  document.getElementById("tbody-house-data").innerHTML = "";
  var checkedBoxes = document.querySelectorAll("input[name = party1]:checked");
  console.log(checkedBoxes);
}
document.getElementById("rep").addEventListener("click", function() {
  clearEverything();
  grabCheckValue(houseMembers);
});

document.getElementById("dem").addEventListener("click", function() {
  clearEverything();
  grabCheckValue(houseMembers);
});

document.getElementById("ind").addEventListener("click", function() {
  clearEverything();
  grabCheckValue(houseMembers);
});

document.getElementById("select").addEventListener("change", function() {
  clearEverything();
  grabCheckValue(houseMembers);
});

function grabCheckValue(hm) {
  var filterMembers = [];
  var checkedBoxesValue = [];
  var checkedBoxes = document.querySelectorAll("input[name='party1']:checked");
  for (var i = 0; i < checkedBoxes.length; i++) {
    if (checkedBoxes[i].checked) {
      checkedBoxesValue.push(checkedBoxes[i].value);
    }
  }
  console.log(checkedBoxesValue);

  if (checkedBoxesValue.length === 0) {
    console.log("no members");
    stateFilter(houseMembers);
  } else {
    for (var i = 0; i < checkedBoxesValue.length; i++) {
      for (var j = 0; j < hm.length; j++) {
        if (checkedBoxesValue[i] == hm[j].party) {
          filterMembers.push(hm[j]);
        }
      }
    }
    stateFilter(filterMembers);
  }
}

//

function filterStep(hm) {
  var uniqueArray = [];
  for (var i = 0; i < hm.length; i++) {
    if (!uniqueArray.includes(hm[i].state)) {
      uniqueArray.push(hm[i].state);
    }
  }
  uniqueArray.sort();
  var select = document.getElementById("select");
  for (var i = 0; i < uniqueArray.length; i++) {
    var option = document.createElement("option");
    option.innerHTML = uniqueArray[i];
    option.setAttribute("value", uniqueArray[i]);
    select.appendChild(option);
  }
}
// filterStep(houseMembers);

function stateFilter(hm) {
  var selectedValue = document.getElementById("select").value;
  var arrayNewTable = [];
  for (var i = 0; i < hm.length; i++) {
    if (hm[i].state === selectedValue) {
      arrayNewTable.push(hm[i]);
    } else if (selectedValue === "all") {
      arrayNewTable.push(hm[i]);
    }
  }
  houseTable(arrayNewTable);
}
