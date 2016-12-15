$(document).ready(function () {

    $("loading").hide();
    $("#forwardButton").hide();
    $("#backButton").hide();
    $("#searchButton").on("click", function () {
        $('#loading').show(200);
        var value = $("#searchBar").val();
        value = getItunesUrl(value);
        searchItunes(value);
    });

    $("#searchBar").keypress(function (e) {
        if (e.which == 13) {
            $("#searchButton").click();
        }
    })
});

var getItunesUrl = function (input) {
    let searchString = input.replace(/ /g, "\+");
    let itunesUrl = "http://itunes.apple.com/search?term=";
    //200 is the maximum search result available
    return (itunesUrl.concat(searchString)).concat("&limit=200");
}

var formatResults = function (searchResult, rowID) {

    let content = '<div class="col-md-3" id="searchResults">';
    content += '<div class="card">';
    content += '<div class = "card-block" style="background-image: url(' + searchResult.artworkUrl100.replace("100x100", "400x400") + ');">';
    content += '<audio src="' + searchResult.previewUrl + '" id="' + searchResult.trackId + '" >';
    content += 'Embedded Preview';
    content += '</audio>'
    content += '<button type="button" class="btn btn-outline-secondary btn-lg" id="' + searchResult.trackId + 'Button">'
    content += '<span class="fa fa-play" aria-hidden="true"></span></button></p>';
    content += '</div><div class="card-footer">'
    content += '<h5 class="card-title" id="songTitle">' + searchResult.trackName + '</h5>';
    content += '<h5 class="card-title" id="artistName">' + searchResult.artistName + '</h5>';
    content += '<h6 class="card-title" id="albumName">' + searchResult.collectionName + '</h6>';
    content += '</div>';
    content += '</div>';
    content += '</div>';
    $('#row' + rowID).append(content);
    playAndPause(searchResult.trackId.toString(), (searchResult.trackId + 'Button'));
}


var playAndPause = function (playID, buttonID) {
    let player = document.getElementById(playID);
    let count = 1;
    $('#' + buttonID).on('click', function () {
        count++;
        if (count % 2 == 0) {
            player.play();
        } else {
            player.pause();
        }
    });
}


var searchItunes = function (input) {
    $.ajax({
            url: input,
            dataType: "JSONP",
            success: function (data) {
                //when this function has succeeded, hide the loading animation and clear the results
               $('#loading').hide(600);
                $('#results').empty();
                if (data.resultCount == 0) {
                    $('#results').append(' <div class="jumbotron text-xs-center vertical-center" id="jumbo" role="alert"><h4>Sorry, no results were found.  </h4><hr>Try another search. </div>');
                } else {
                    let results = data.results;
                    populatePages(results, 1);

                }
            }

        })
        .done(function (data) {
            console.log(data);
        })
        .fail(function (data) {
            console.log(data);
        })

}

var populatePages = function (element, page) {
    page = (page > 0) ? page : 1;
    $('#results').empty();
    var resultsPerPage = 20
    pageNavigation(page, (Math.ceil((element.length) / (resultsPerPage))), element);
    let id = 0;
    //20 elements per page
    let startingIndex = (page - 1) * 20;
    let endingIndex = ((startingIndex + 20) > element.length) ? element.length : (startingIndex + 20);
    for (let i = startingIndex; i < endingIndex; i++) {
        if ((i % 4 == 0) || i == 0) {
            id++;
            let newRow = '<div class = "row" id=row' + id + '> </div>';
            $('#results').append(newRow);
        }
        formatResults(element[i], id);
    }
}

var pageNavigation = function (page, lastPage, element) {

    $("#forwardButton").show().prop("disabled", false);
    $("#backButton").show().prop("disabled", false);
    if (page == 1) {
        $("#backButton").prop("disabled", true);
    }
    if (page == lastPage) {
        $("#forwardButton").prop("disabled", true);
    }

    $("#backButton").on('click', function () {
        
        console.log("back a page!" + page);
        populatePages(element, page - 1);
    });
    $("#forwardButton").on('click', function () {
        
        console.log("forward a page!" + page);
        populatePages(element, page + 1);
    });
}
