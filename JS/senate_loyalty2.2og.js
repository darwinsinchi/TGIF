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
    senateMembers = json.results[0].members;
    gatheringData1(senateMembers);
    wholeTable1(allMembers, allParty, allPercentage, "tbody-senate-loyalty");

    senateMembers.sort(leastLoyal);
    leastLoyal10(senateMembers);

    senateMembers.sort(mostLoyal);
    wholeTable2(mostLoyal10(senateMembers), "tbody-senate-loyalty3");
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
  //this is to add the totals of # of members
  function addeverything(accumulator, a) {
    return accumulator + a;
  }
  var sum = test2.reduce(addeverything);

  tdNumofRep.innerHTML = sum;
  var sum2 = test3.reduce(addeverything);
  //   function addeverything(accumulator, a) {
  //     return accumulator + a;
  //   }
  tdVotedwithParty.innerHTML = sum2;
}

//new tables for 2nd and third

// table for least attendance

function leastLoyal(a, b) {
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return 1;
  } else {
    return 0;
  }
}

function leastLoyal10(members) {
  var arrayreducingMembers2 = [];
  var reducingMembers2 = members.length * 0.1;

  for (var i = 0; i < reducingMembers2; i++) {
    arrayreducingMembers2.push(members[i]);
  }
  console.log(arrayreducingMembers2);
  wholeTable2(arrayreducingMembers2, "tbody-senate-loyalty2");
}

//function below is to sort them based of missed votes %
function mostLoyal(a, b) {
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return 1;
  } else {
    return 0;
  }
}

function mostLoyal10(members) {
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
    var tdTotalVotes = document.createElement("td");
    var tdVotesWithParty = document.createElement("td");

    attach.append(tRow);

    tRow.append(tdName);
    tRow.append(tdTotalVotes);
    tRow.append(tdVotesWithParty);

    var textLink2 = document.createElement("a");
    textLink2.setAttribute("href", test1[i].url);
    //This is to connect the hyperlink to the name

    textLink2.innerHTML =
      test1[i].first_name +
      " " +
      test1[i].middle_name +
      " " +
      test1[i].last_name;
    if (test1[i].middle_name == null) {
      textLink2.innerHTML = test1[i].first_name + " " + test1[i].last_name;
    }
    tdName.append(textLink2);
    tdTotalVotes.innerHTML = test1[i].total_votes;
    tdVotesWithParty.innerHTML =
      test1[i].votes_with_party_pct.toFixed(2) + " " + "%";
  }
}
