$(document).ready(function(){
    $("button").on("click", function(){
     var value=  $("#searchBar").val(); 
     value = getItunesUrl(value);
     $("#test").text(value);
     $('#results').empty();
     searchItunes(value);
    });

   $("#searchBar").keypress(function(e){
       if(e.which == 13){
           $("#searchButton").click();
       }
   }) 
});

var getItunesUrl = function(input){
 let searchString = input.replace(/ /g, "\+");
 let itunesUrl = "http://itunes.apple.com/search?term=";
 return itunesUrl.concat(searchString);
}

var formatResults = function(searchResult, rowID){
 
let content = '<div class="col-sm-3" id="searchResults">';
content += '<div class="card">';
content += '<div class = "card-block">';
content += '<img src="'+searchResult.artworkUrl100+'" class="img-fluid" id = "albumArt" alt="Responsive image">'
content += '<p>' + searchResult.trackName + " - ";
content += searchResult.artistName + '</p>';
content +='<audio src="'+ searchResult.previewUrl+ '" id="'+searchResult.trackId+'" >';
content += 'Embedded Preview';
content += '</audio>'
content += '<button id="'+searchResult.trackId+'Button">play</play>'
content += '</div>';
content += '</div>';
content += '</div>';
console.log(content);
$('#row'+rowID).append(content);
playAndPause(searchResult.trackId.toString(), (searchResult.trackId+'Button'));
}


var playAndPause = function(playID, buttonID){
let player = document.getElementById(playID);
let count =0;
$('#'+buttonID).on('click',function(){
    count++;
    if(count%2==0){
    player.play();}
    else{
        player.pause();}
});
}


var searchItunes = function(input){
    $.ajax({
        url: input,
        dataType: "JSONP",
        success:function(data){
           let id = 0;
            for(let i=0; i<20; i++){
                    if((i%4==0)||i==0){
                        id++;
                        let newRow = '<div class = "row" id=row'+id+'> </div>';
                        $('#results').append(newRow);
                    }
                    formatResults(data.results[i],id);
            }
        }
        
    })
    .done(function(data){console.log(data);})
    .fail(function(data){console.log(data);})

}

