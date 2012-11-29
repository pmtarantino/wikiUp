function wikiUp(page,wiki,lang) {

	var error_txt	= 'Error. Try again.'; // Error Message.
	var loading_txt	= 'Loading'; // Loading Message.
	var lang = typeof lang !== 'undefined' ? lang : 'en'; // Default Lang

    var wikiBox = $('#'+wiki);
	var url = 'http://'+lang+'.wikipedia.org/w/api.php?callback=?&action=parse&page='+page+'&prop=text&format=json&section=0';
	$.ajax({
			type: "GET",
			url: url,
			data: {},
			async:true,
			contentType: "application/json; charset=utf-8",
			dataType: "jsonp",
			success: function(response) {

				var Find = false;
				var Par = 0;
				while(Find == false){
					Find = true;
					var intro = $(response.parse.text['*']).filter("p:eq("+Par+")").html();
					if( intro.indexOf("<span") == 0 ) {
						var Par = Par+1;
						var Find = false;
					}
				}
                 wikiBox.empty().html(intro);
                wikiBox.find("a:not(.references a)").attr("href", function(){ return "http://"+lang+".wikipedia.org" + $(this).attr("href");});
                wikiBox.find("a").attr("target", "_blank");
                wikiBox.find('sup.reference').remove(); 
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				wikiBox.html(error_txt);
			},
			beforeSend: function (XMLHttpRequest) {
				wikiBox.html(loading_txt);
			}
	});
	
}

$(document).ready(function(){
	var wikiQuantity = 0;
	$('data').mouseover(function(){
		if($(this).find('span').length){
		}
		else{
			$(this).append("<span class='tooltip'><span></span><div id='Wiki"+wikiQuantity+"'></div></span>");
			wikiUp($(this).attr('data-wiki'),'Wiki'+wikiQuantity,$(this).attr('data-lang'));
			wikiQuantity++;
		}
	});
});