/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*eslint "no-undef": "off"*/
/*global $*/


//We create variables to store the APIs.
var urlSenate = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
var urlHouse = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
var url;


//We call the different links depending of the information we need.
    if ($("#generalTableSenate").hasClass("senate")) {
        url = urlSenate;
    } else {
        url = urlHouse;
    }


//We creare a function to call the JSON with jQuery.
//Other option could be -> document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2).
$.getJSON(url,function (data) { 
    var members = data.results[0].members;
    var templateTable= $("#partyTable").html();
    var html = Mustache.render(templateTable, data.results[0]);
    $("#generalCongress-data").html(html);

      
/*
var tbody = document.getElementById("generalCongress-data");
var selectTheStates = document.getElementById("statesFilter");

for (var i = 0; i < members.length ; i++){
    var currentMember = members[i]
    
    var cell = '<td><a href="' + currentMember.url +'">' + currentMember.first_name + " " + currentMember.last_name + '</a></td>';
    var cell1 = '<td class="party">' + currentMember.party +'</td>';
    var cell2 = '<td class="state">' + currentMember.state +'</td>';
    var cell3 = '<td>' + currentMember.seniority +'</td>';
    var cell4 = '<td>' + currentMember.votes_with_party_pct +'</td>';
    tbody.innerHTML += cell + cell1 + cell2 + cell3 + cell4;
}    
   var eachState = '<option>' + currentMember.state + '</option>';
selectTheState.innerHTML += eachState;
*/
    
    
sortTheStatesWithoutRepeating(members); 

    
//We create this function that shows the senator when their party is selected.    
function getTheSenatorsForEachParty() {
    var partySelected = $("input[name='filterStatus']:checked")
        .map(function () {
            return $(this).val();
        })
        .get();
    $(".myTable").each(function (index, row) {
        
        var partyValue = $(row).find('.party').text();
        var stateValue = $(row).find('.state').text();
        var stateSelected = $("#statesFilter").val();
        var showMe = (stateValue == stateSelected) || stateSelected == "states";
        
        if((partySelected.includes(partyValue) || partySelected.length == 0) && showMe ){
            $(row).show();
        }else {
            $(row).hide();
        }  
    });
}

    
//Cuando se hace un click en el input, se seleccionaran los senadores.
$("input[name='filterStatus']").on("click", getTheSenatorsForEachParty);
$("#statesFilter").on("change", getTheSenatorsForEachParty);


//Funcion que se hace para poder ordenar los estados.   
function sortTheStatesWithoutRepeating(statesArray){
    var dropdown = $("#statesFilter")
    var arraydropdown =[];
    
    var finalOrder = statesArray.sort(function (a,b) {
        return (a.state > b.state) ? 1 : ((b.state > a.state)? -1 : 0);
    });
    
    $(finalOrder).each(function(i,members){
        
        if(!arraydropdown.includes(members.state)){
            arraydropdown.push(members.state);
            dropdown.append($("<option/>").val(members.state).text(members.state));
        }
    });
    
} 

    
//Luego de aplicar el framework de data tables, le damos la configuracion que queremos.
$(document).ready(function() {
    $('.table').DataTable( {
        "dom": 'frti',
        "scrollY":        "250px",
        "scrollCollapse": true,
        "paging":         false,
    } );
} );
    
$(document).ready(function() {
    $('a.colorbox').colorbox( {
        opacity: 0.5,
        rel:"group1"
    } );
} );
    
});

