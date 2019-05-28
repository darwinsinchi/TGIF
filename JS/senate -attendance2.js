// var senateMembers = data.results[0].members;
var myVar;
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
    var overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    console.log(json.results[0].members);
    senateMembers = json.results[0].members;
    gatheringData1(senateMembers);
    wholeTable1(
      allMembers,
      allParty,
      allPercentage,
      "tbody-senate-attendance1"
    );

    senateMembers.sort(leastEngaged);
    leastEngaged10(senateMembers);

    senateMembers.sort(mostEngaged);
    wholeTable2(mostEngaged10(senateMembers), "tbody-senate-attendance3");
    showPage(wholeTable1);
  })
  .catch(function(error) {
    console.log("Request failed:" + error.message);
  });

var stats = {
  numofrep: 0,
  numofdem: 0,
  numofind: 0,
  repvote: 0,
  demvote: 0,
  indvote: 0
};

var arrayR = [];
var arrayD = [];
var arrayI = [];
var votesPerRep = 0;
var votesPerDem = 0;
var votesPerInd = 0;

//Creating arrays and attaching them to stats that are required for the first table
// allMembers = ["Democrats", "Republicans", "Independent", "Total"];

function gatheringData1(members) {
  for (var i = 0; i < members.length; i++) {
    if (members[i].party == "R") {
      arrayR.push(members[i]);
      votesPerRep += members[i].votes_with_party_pct;
      //below gives me count of representatives
      stats.numofrep = arrayR.length;

      //below gives me the % that voted with the Party
      stats.repvote = votesPerRep / arrayR.length;
    } else if (members[i].party == "D") {
      arrayD.push(members[i]);
      votesPerDem += members[i].votes_with_party_pct;
      stats.numofdem = arrayD.length;
      stats.demvote = votesPerDem / arrayD.length;
    } else if (members[i].party == "I") {
      arrayI.push(members[i]);
      votesPerInd += members[i].votes_with_party_pct;
      stats.numofind = arrayI.length;
      stats.indvote = votesPerInd / arrayI.length;
    }
  }
  allMembers = ["Democrats", "Republicans", "Independent", "Total"];
  allParty = [stats.numofrep, stats.numofdem, stats.numofind];
  allPercentage = [
    stats.repvote.toFixed(2) + " " + "%",
    stats.demvote.toFixed(2) + " " + "%",
    stats.indvote.toFixed(2) + " " + "%"
  ];
  allPercentage1 = [stats.repvote, stats.demvote, stats.indvote];
}

function wholeTable1(test1, test2, test3, tableid1) {
  var attach = document.getElementById(tableid1);
  for (i = 0; i < test1.length; i++) {
    var tRow = document.createElement("tr");
    var tdParty = document.createElement("td");
    var tdNumofRep = document.createElement("td");
    var tdVotedwithParty = document.createElement("td");

    attach.append(tRow);

    tRow.append(tdParty);
    tRow.append(tdNumofRep);
    tRow.append(tdVotedwithParty);

    tdParty.innerHTML = test1[i];
    tdNumofRep.innerHTML = test2[i];
    tdVotedwithParty.innerHTML = test3[i];
  }
  function addeverything(accumulator, a) {
    return accumulator + a;
  }
  var sum = test2.reduce(addeverything);

  tdNumofRep.innerHTML = sum;
  //this is to get the weigthed average
  var sum2 = 0;
  for (var i = 0; i < allParty.length; i++) {
    sum2 += (allParty[i] / sum) * allPercentage1[i];
    tdVotedwithParty.innerHTML = sum2.toFixed(2) + " " + "%";
  }
  console.log(sum2);
}

//new tables for 2nd and third

// table for least attendance

function leastEngaged(a, b) {
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return 1;
  } else {
    return 0;
  }
}

function leastEngaged10(members) {
  var arrayreducingMembers2 = [];
  var reducingMembers2 = members.length * 0.1;

  for (var i = 0; i < reducingMembers2; i++) {
    arrayreducingMembers2.push(members[i]);
  }
  console.log(arrayreducingMembers2);
  wholeTable2(arrayreducingMembers2, "tbody-senate-attendance2");
}

//function below is to sort them based of missed votes %
function mostEngaged(a, b) {
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return 1;
  } else {
    return 0;
  }
}

function mostEngaged10(members) {
  var arrayreducingMembers = [];
  var reducingMembers = members.length * 0.1;
  for (var i = 0; i < reducingMembers; i++) {
    arrayreducingMembers.push(members[i]);
  }
  console.log(arrayreducingMembers);
  return arrayreducingMembers;
}

function wholeTable2(test1, tableid) {
  var attach = document.getElementById(tableid);
  for (i = 0; i < test1.length; i++) {
    var tRow = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdNumMissedVotes = document.createElement("td");
    var tdPercentMissed = document.createElement("td");

    attach.append(tRow);

    tRow.append(tdName);
    tRow.append(tdNumMissedVotes);
    tRow.append(tdPercentMissed);

    var textLink2 = document.createElement("a");
    textLink2.setAttribute("href", test1[i].url);
    //This is to connect the hyperlink to the name

    textLink2.innerHTML =
      test1[i].last_name +
      " " +
      test1[i].first_name +
      " " +
      test1[i].middle_name;
    if (test1[i].middle_name == null) {
      textLink2.innerHTML = test1[i].last_name + " " + test1[i].first_name;
    }
    tdName.append(textLink2);
    tdNumMissedVotes.innerHTML = test1[i].missed_votes;
    tdPercentMissed.innerHTML =
      test1[i].missed_votes_pct.toFixed(2) + " " + "%";
  }
}
