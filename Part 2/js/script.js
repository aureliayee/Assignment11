$(function () {
    var teamCtn, employeeRec = [], count = {}, x, i, mgrID, mgrID2, mgrName;
    
    ////Home Page ListView JSON call
    $.getJSON("data/team.js", function (data) {
        for (i = 0; i < 12; i++) {
            x = data.teammembers[i].ReportsTo;
            employeeRec.push(x);
        }
        employeeRec.forEach(function (i) { count[i] = (count[i] || 0) + 1;  });
        $.each(data, function () {
            $.each(this, function (key, value) {
                teamCtn = count[value.ID];
                if (teamCtn === undefined) {
                    teamCtn = "0";
                }
                $("#result").append('<li data-filtertext="' + value.Name + '"><a href="#details" id="' + value.ID + '"><img src="' + value.ImagePath + '"> <h2>' + value.Name + '</h2><p>' + value.Title + '</p><div class="ui-li-count">' + teamCtn + '</div></a></li>');
            });
            $("#result").listview('refresh');
        });
    });
    
    ////Hiding and showing welcome message
    $("input[data-type='search']").on("keyup change input", function () {
        var searchVal = $(this).val();
        if (searchVal === "") {
            $("#welcome").delay(200).fadeIn(1000);
        } else {
            $("#welcome").hide();
        }
    });

    ////Clearing Home page search upon clicking search button
    $("#search").on("click", function () {
        $('input[data-type="search"]').val("");
        $('input[data-type="search"]').trigger("keyup");
    });
    
    ////Showing Data
    $(document).on("click", "a", function (e) {
        var currentid = e.currentTarget.id;
        //Defining variable for mgrID
        $.getJSON("data/team.js", function (data) {
            $.each(data, function () {
                $.each(this, function (key, value) {
                    if (value.ID === currentid) {
                        mgrID = value.ReportsTo;
                    }
                });
            });
        });
        
        //Defining variable for mgrName
        $.getJSON("data/team.js", function (data) {
            $.each(data, function () {
                $.each(this, function (key, value) {
                    if (value.ID === mgrID) {
                        mgrName = value.Name;
                    }
                });
            });
        });
        
        //Details Page
        $.getJSON("data/team.js", function (data) {
            $.each(data, function () {
                $.each(this, function (key, value) {
                    teamCtn = count[value.ID.toString()];
                    if (teamCtn === undefined) {
                        teamCtn = "0";
                    }
                    if (value.ID === currentid) {
                        $("#empDetails").html('<img src="' + value.ImagePath + '"><h3>' + value.Name + '</h3><br>' + value.Title);
                        $("#empDetailsList").html('<li><a href = "#details" id = "' + value.ReportsTo + '"><h5>View Manager</h5><p>' + mgrName + '</p></a></li>' +
                                                  '<li><a href = "#teamMembers"><h5>View Direct Reports</h5><p>' + teamCtn + '</p></a></li>' +
                                                  '<li><a href = "tel:' + value.OfficeNumber + '"><h5>Call Office</h5><p>' + value.OfficeNumber + '</p></a></li>' +
                                                  '<li><a href = "tel:' + value.CellNumber + '"><h5>Call Cell</h5><p>' + value.CellNumber + '</p></a></li>' +
                                                  '<li><a href = "mailto:' + value.Email + '"><h5>Email</h5><p>' + value.Email + '</p></a></li>'
                                                 );
                    }
                    
                    //Direct Report Page
                    if (value.ReportsTo === currentid) {
                        $("#teamMembersResult").append('<li data-filtertext="' + value.Name + '"><a href="#details" id="' + value.ID + '"><img src="' + value.ImagePath + '"> <h2>' + value.Name + '</h2><p>' + value.Title + '</p><div class="ui-li-count">' + teamCtn + '</div></a></li>');
                    }
                });
                $("#empDetailsList").listview('refresh');
                $("#teamMembersResult").listview('refresh');
            });
        });
    });
    ////clearing out direct reports page
    $(document).on("click", function () {
        if (window.location.hash !== "#teamMembers") {
            $("#teamMembersResult").empty();
        }
    });
});