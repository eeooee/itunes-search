$(document).ready(function(){
    $("button").on("click", function(){
     var value=  $("#searchBar").val(); 
     value = getItunesUrl(value);
     $("#test").text(value);
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

var searchItunes = function(input){
    $.ajax({
        url: input,
        dataType: "JSONP"
    })
    .done(function(data){console.log(data);})
    .fail(function(data){console.log(data);})

}