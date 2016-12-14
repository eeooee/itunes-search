$(document).ready(function () {

    $("#forwardButton").hide();
    $("#backButton").hide();
    $("#searchButton").on("click", function () {
        var value = $("#searchBar").val();
        value = getItunesUrl(value);
        $("#test").text(value);
        $('#results').empty();
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
    return itunesUrl.concat(searchString);
}

var formatResults = function (searchResult, rowID) {

    let content = '<div class="col-sm-3" id="searchResults">';
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
    console.log(content);
    $('#row' + rowID).append(content);
    playAndPause(searchResult.trackId.toString(), (searchResult.trackId + 'Button'));
}


var playAndPause = function (playID, buttonID) {
    let player = document.getElementById(playID);
    let count = 0;
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
                if (data.resultCount == 0) {
                    $('#results').append('<h1>Sorry, no music was found!</h2>');
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

    $("#forwardButton").show();
    $("#backButton").show();
    if (page == 1) {
        $("#backButton").hide();
    }
    if (page == lastPage) {
        $("#forwardButton").hide();
    }

    $("#backButton").on('click', function () {
        populatePages(element, page - 1);
    });
    $("#forwardButton").on('click', function () {
        populatePages(element, page + 1);
    });
}
