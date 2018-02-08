/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $*/
var urlSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
var urlHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
var url;

    if ($("#generalTableSenate").hasClass("senate")) {
        url = urlSenate;
    } else {
        url = urlHouse;
    }

//Información json. Sirve para que esta informacion se pueda compartir.
var statistics = {
    "Democrats": {
        "NumberOfReps": "0",
        "VotedWithParty": "0"
    },
    "Republicans": {
        "NumberOfReps": "0",
        "VotedWithParty": "0"
    },
    "Independets": {
        "NumberOfReps": "0",
        "VotedWithParty": "0"
    },
    "Total": {
        "NumberOfReps": "0",
        "VotedWithParty": "0"
    },
    "MostEngagedAttendance": [
      /*"fullName" : "default",
        "votes"    : "0",
        "percentage" : "0"*/
    ],
    "LeastEngagedAttendance": [
      /*"fullName" : "default",
        "votes"    : "0",
        "percentage" : "0"*/
    ],
}

//Ejecuta las funciones en HTML
$.getJSON(url,function (data) {
    /*var tbody = document.getElementById("tableLeastAttendance");*/
    var members = data.results[0].members;

    //Guardar el resultado de las funciones para el numero de representantes.
    var democratMembers = getTheMembersOfAParty(members, "D");
    var republicanMembers = getTheMembersOfAParty(members, "R");
    var independentMembers = getTheMembersOfAParty(members, "I");
    var totalMembers = democratMembers.length + republicanMembers.length + independentMembers.length;

    statistics.Democrats.NumberOfReps = democratMembers.length;
    statistics.Republicans.NumberOfReps = republicanMembers.length;
    statistics.Independets.NumberOfReps = independentMembers.length;
    statistics.Total.NumberOfReps = totalMembers;

    //Guardar el resultado de las funciones para el porcentaje de representantes.
    var percentageDemocratMembers = getThePercentageOfVotesForAParty(democratMembers);
    var percentageRepublicanMembers = getThePercentageOfVotesForAParty(republicanMembers);
    var percentageIndependentMembers = getThePercentageOfVotesForAParty(independentMembers);
    var percentageTotalMembers = getThePercentageOfVotesForAParty(members);

    statistics.Democrats.VotedWithParty = percentageDemocratMembers;
    statistics.Republicans.VotedWithParty = percentageRepublicanMembers;
    statistics.Independets.VotedWithParty = percentageIndependentMembers;
    statistics.Total.VotedWithParty = percentageTotalMembers
    console.log(statistics);

    //Crear la tabla de house at a glance y guardar la informacion anterior.
    document.getElementById("generalTable").innerHTML = '<tr><td>Democrats</td><td>' + statistics.Democrats.NumberOfReps + '</td><td>' + statistics.Democrats.VotedWithParty + '</td></tr>' +
        '<tr><td>Republicans</td><td>' + statistics.Republicans.NumberOfReps + '</td><td>' + statistics.Republicans.VotedWithParty + '</td></tr>' +
        '<tr><td>Independents</td><td>' + statistics.Independets.NumberOfReps + '</td><td>' + statistics.Independets.VotedWithParty + '</td></tr>' +
        '<tr><td>Total</td><td>' + statistics.Total.NumberOfReps + '</td><td>' + statistics.Total.VotedWithParty + '</td></tr>'


    //Para que no haya un error al ejecutar todas las funciones. Señalamos que pagina va para cual.
    if ($("#attendanceTable").hasClass("attendance")) {
        getTheMostEngagedAttendance(members);
        getTheLeastEngagedAttendance(members);
    } else {
        getTheMostEngagedLoyal(members);
        getTheLeastEngagedLoyal(members);
        getThePartyVotes(members);
    }
    createTableLeastAttendance();
    createTableMostAttendance();



//FUNCIONES-------------------------------------------------------------------------

//Esta funcion es para sacar el numero de representantes de cada partido politico.
function getTheMembersOfAParty(membersArray, partyValue) {
    var outputArray = [];
    for (var i = 0; i < membersArray.length; i++) {
        var currentMember = membersArray[i];

        if (currentMember.party === partyValue) {
            outputArray.push(currentMember);
        }
    }
    return outputArray;
}

//Esta funcion es para sacar el porcentaje de reprensentantes de cada partido politico.
function getThePercentageOfVotesForAParty(membersArray) {
    var sumPercentage = 0;
    for (var j = 0; j < membersArray.length; j++) {
        sumPercentage += +(membersArray[j].votes_with_party_pct);
    }
    var averagePercentage = sumPercentage / membersArray.length;
    return averagePercentage.toFixed(2);
}


function sortTheIncreasedArray(membersArray) {
    var myNewArray1 = membersArray.reverse(function (a, b) {
        return a.missed_votes - b.missed_votes;
    });
    return myNewArray1;
}

function getTheLeastEngagedAttendance(membersArray) {
    var sortedArray1 = (sortTheIncreasedArray(membersArray));
    

    for (var j = 0; j < sortedArray1.length; j++) {

        var objLeastEngagedAttendance = {};
        objLeastEngagedAttendance.name = sortedArray1[j].first_name + " " + sortedArray1[j].last_name;
        objLeastEngagedAttendance.votes = sortedArray1[j].missed_votes;
        objLeastEngagedAttendance.percentage = sortedArray1[j].missed_votes_pct;

        if (j < (sortedArray1.length) * 0.10) {
            statistics.LeastEngagedAttendance.push(objLeastEngagedAttendance);
        } else if (sortedArray1[j - 1].missed_votes === sortedArray1[j].missed_votes) {
            statistics.LeastEngagedAttendance.push(objLeastEngagedAttendance);
        } else {
            break;
        }
    }
}

function createTableLeastAttendance() {
    var tableLeastAttendance = document.getElementById("tableLeastAttendance");

    for (var j = 0; j < statistics.LeastEngagedAttendance.length; j++) {
        var newRowAttendance = document.createElement("tr");

        newRowAttendance.insertCell().innerHTML = statistics.LeastEngagedAttendance[j].name;
        newRowAttendance.insertCell().innerHTML = statistics.LeastEngagedAttendance[j].votes;
        newRowAttendance.insertCell().innerHTML = statistics.LeastEngagedAttendance[j].percentage;
        tableLeastAttendance.append(newRowAttendance);
    }
}

//Esta funcion es para ordenar la informacion de la tabla de Most Engaged Attendance.
function sortTheDecreasedArray(membersArray) {
    var myNewArray = membersArray.sort(function (a, b) {
        return a.missed_votes - b.missed_votes;
    });
    return myNewArray;
}


function getTheMostEngagedAttendance(membersArray) {
    var sortedArray = (sortTheDecreasedArray(membersArray));
  
    for (var i = 0; i < sortedArray.length; i++) {

        var objMostEngagedAttendance = {};
        objMostEngagedAttendance.name = sortedArray[i].first_name + " " + sortedArray[i].last_name;
        objMostEngagedAttendance.votes = sortedArray[i].missed_votes;
        objMostEngagedAttendance.percentage = sortedArray[i].missed_votes_pct;
        

        if (i < (sortedArray.length) * 0.10) {
            statistics.MostEngagedAttendance.push(objMostEngagedAttendance);
        }else if(sortedArray[i - 1].missed_votes === sortedArray[i].missed_votes)
            {statistics.MostEngagedAttendance.push(objMostEngagedAttendance);
         } else {
                break;
            }
        }
    }

function createTableMostAttendance() {
    var tableMostAttendance = document.getElementById("tableMostAttendance");

    for (var j = 0; j < statistics.MostEngagedAttendance.length; j++) {
        var newRowAttendance = document.createElement("tr");

        newRowAttendance.insertCell().innerHTML = statistics.MostEngagedAttendance[j].name;
        newRowAttendance.insertCell().innerHTML = statistics.MostEngagedAttendance[j].votes;
        newRowAttendance.insertCell().innerHTML = statistics.MostEngagedAttendance[j].percentage;
        tableMostAttendance.append(newRowAttendance);
    }
}



function getThePartyVotes(membersArray) {
    return ((membersArray.total_votes - membersArray.missed_votes) * membersArray.votes_with_party_pct) / 100;
}


function sortTheIncreasedArrayLoyal(membersArray) {
    var myNewArrayLoyal1 = membersArray.reverse(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    return myNewArrayLoyal1;
}

function getTheLeastEngagedLoyal(membersArray) {
    var sortedArrayLoyal1 = (sortTheIncreasedArrayLoyal(membersArray));
    var sortedArrayLoyal1IncludingRepetitive = Math.round((sortedArrayLoyal1.length * 0.10) - 1);
    var tableLeastLoyal = document.getElementById("tableLeastLoyal");

    for (var a = 0; a <= sortedArrayLoyal1IncludingRepetitive; a++) {
        var newRowLoyal1 = document.createElement("tr");

        while (sortedArrayLoyal1[sortedArrayLoyal1IncludingRepetitive].votes_with_party_pct === sortedArrayLoyal1[sortedArrayLoyal1IncludingRepetitive + 1].votes_with_party_pct) {
            sortedArrayLoyal1IncludingRepetitive++
        }
        newRowLoyal1.insertCell().innerHTML = sortedArrayLoyal1[a].first_name + " " + sortedArrayLoyal1[a].last_name;
        newRowLoyal1.insertCell().innerHTML = (getThePartyVotes(sortedArrayLoyal1[a])).toFixed(0);
        newRowLoyal1.insertCell().innerHTML = sortedArrayLoyal1[a].votes_with_party_pct;
        tableLeastLoyal.append(newRowLoyal1);
    }
}

function sortTheDecreasedArrayLoyal(membersArray) {
    var myNewArrayLoyal = membersArray.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    return myNewArrayLoyal;
}


function getTheMostEngagedLoyal(membersArray) {
    var sortedArrayLoyal = (sortTheDecreasedArrayLoyal(membersArray));
    var sortedArrayLoyalIncludingRepetitive = Math.round((sortedArrayLoyal.length * 0.10) - 1);
    var tableMostLoyal = document.getElementById("tableMostLoyal");

    for (var a = 0; a <= sortedArrayLoyalIncludingRepetitive; a++) {
        var newRowLoyal = document.createElement("tr");

        while (sortedArrayLoyal[sortedArrayLoyalIncludingRepetitive].votes_with_party_pct === sortedArrayLoyal[sortedArrayLoyalIncludingRepetitive + 1].votes_with_party_pct) {
            sortedArrayLoyalIncludingRepetitive++
        }
        newRowLoyal.insertCell().innerHTML = sortedArrayLoyal[a].first_name + " " + sortedArrayLoyal[a].last_name;
        newRowLoyal.insertCell().innerHTML = getThePartyVotes(sortedArrayLoyal[a]).toFixed();
        newRowLoyal.insertCell().innerHTML = sortedArrayLoyal[a].votes_with_party_pct;
        tableMostLoyal.append(newRowLoyal);
    }
}   
$(document).ready(function() {
    $('.two').DataTable( {
        "dom": 'rt',
        "scrollY":        "250px",
        "scrollCollapse": true,
        "paging":         false,
        "order": [[ 2, "desc" ]]
    } );
} );  
    
$(document).ready(function() {
    $('.three').DataTable( {
        "dom": 'rt',
        "scrollY":        "250px",
        "scrollCollapse": true,
        "paging":         false,
        "order": [[ 2, "asc" ]]
    } );
} ); 
    
});