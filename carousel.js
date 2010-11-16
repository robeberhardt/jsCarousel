var imageArray = new Array();
var campaignData;
var campaignImagesSet;
var count = 0;
var item_width;
var left_value;
var currentSlideIndex;

var dataURL="http://www.dng.com.php5-15.dfw1-2.websitetestlink.com/xml/home_carousel";

$(document).ready(function() {
    $.ajax({ 
        type: "GET",
        url: dataURL,
        dataType: "xml",
        success: gotCampaignData
    });
});

function gotCampaignData(data)
{
		campaignData = data;
    campaignImagesSet = $(data).find('campaign').find('posterImage').find('url');
   /*
 trace("there are " + $(campaignData).find('campaign').length + " campaign items");
    trace("there are " + campaignImagesSet.length + " campaign images...");
*/
    loadNextImage();
}

function loadNextImage()
{
    var image = new Image();
    var imageurl = $(campaignImagesSet[count]).text();
/*     trace("trying to load " + imageurl); */
    
    $(image).load( function() { 
/*         trace("loaded " + imageurl); */
        
        imageArray.push(imageurl);
        count ++;
        if (count < campaignImagesSet.length)
        {
            loadNextImage();
        } 
            else
        {
/*             trace("that's all folks!"); */
            showData();
            buttonSetup();
            addCarouselItems();
        }
    }).error( function() {}).attr('src', imageurl);
    
};

function buttonSetup()
{
	$(".hover").fadeTo(1, 0, function() 
		{
			$(this).css("display", "block")
		});
		
	$('#hover_prev_button').hover(function() 
		{
			$("#hover_prev_button").stop().fadeTo("fast", 0.95);
		}, function() 
		{
			$("#hover_prev_button").stop().fadeTo("fast", 0.00);
		}); 

	$('#hover_next_button').hover(function() {
			$("#hover_next_button").stop().fadeTo("fast", 0.95);
		}, function() 
		{
			$("#hover_next_button").stop().fadeTo("fast", 0.00);
		}); 
}

function showData()
{
	$(campaignData).find('campaign').each( function() {  
/* 		trace('this = ' + $(this)); */
		var html = '<div class="campaign">';
		html += '<h1 class="headline">' + $(this).find('headline').text() + '</h1>';
		html += '<hr>';
		html += '</div>';
/* 		trace(html); */
		$('#data').append($(html));
	});
	
}

function addCarouselItems()
{
          
	var html = '<ul>';
	for (var i=0; i<imageArray.length; i++)
	{
	    html += '<li><img src="' + imageArray[i]+'" alt=""/></li>';
	}
	html += '</ul>';
	$('#slides').append($(html));
	$('.loading').hide();
	
	$('#slides ul').width('3840px');
	
	startCarousel();        
        
}

function startCarousel() {

	currentSlideIndex = 0;
	
	showInfo();

	$('#slides').bind('next_slide', { 'msg' : 'next slide' }, function(e) { handleEvent(e); });
	$('#slides').bind('prev_slide', { 'msg' : 'previous slide' }, function(e) { handleEvent(e); });
	$('#slides').bind('anim_start', { 'msg' : 'animation started' }, function(e) { handleEvent(e); });
	$('#slides').bind('anim_done', { 'msg' : 'animation complete' }, function(e) { handleEvent(e); });
	
	
	
	
/*     trace("starting carousel..."); */
    //rotation speed and timer
    var speed = 10000;
    var run = setInterval('rotate()', speed);    
    
    //grab the width and calculate left value
    item_width = $('#slides li').outerWidth(); 
    left_value = item_width * (-1); 
        
    //move the last item before first item, just in case user click prev button
    $('#slides li:first').before($('#slides li:last'));
    
    //set the default item to the correct position 
    $('#slides ul').css({'left' : left_value});

   buttonsOn();
 
    //if mouse hover, pause the auto rotation, otherwise rotate it
    $('#slides').hover(
        
        function() {
            clearInterval(run);
        }, 
        function() {
            run = setInterval('rotate()', speed);    
        }
    ); 
        
}

function rotate() {
    $('#hover_next_button').click();
}


/*
*
*     ------------------------------ Button Functions ------------------------------
*
*/

function nextButtonClick()
{
	$('#slides').trigger('next_slide');
	
	currentSlideIndex ++;
	if (currentSlideIndex > campaignImagesSet.length-1) currentSlideIndex = 0;
	trace(currentSlideIndex);
	
	//get the right position
	var left_indent = parseInt($('#slides ul').css('left')) - item_width;
	
	$('#slides').trigger('anim_start');
	
	$('#slides ul').stop().animate({
	
		"left": left_indent },
		{
			"duration": 600,
			"easing": "easeOutQuint",
			"complete": function() 
			{  
				$('#slides').trigger('anim_done'); 
				
				//move the first item and put it as last item
				$('#slides li:last').after($('#slides li:first'));                     
				
				//set the default item to correct position
				$('#slides ul').css({'left' : left_value});
				
				
			}
		});
	
	//cancel the link behavior
	return false;

}

function prevButtonClick()
{
	$('#slides').trigger('prev_slide');
	
	currentSlideIndex --;
	if (currentSlideIndex <0) currentSlideIndex = campaignImagesSet.length-1;
	trace(currentSlideIndex);
	
	//get the right position            
	var left_indent = parseInt($('#slides ul').css('left')) + item_width;
	
	$('#slides').trigger('anim_start');
	
	$('#slides ul').stop().animate({
	
		"left": left_indent },
		{
			"duration": 600,
			"easing": "easeOutQuint",
			"complete": function() 
			{  
				$('#slides').trigger('anim_done'); 
			
				//move the first item and put it as last item
				$('#slides li:first').before($('#slides li:last'));                  
				
				//set the default item to correct position
				$('#slides ul').css({'left' : left_value});
				
				
			}
		});
	
	//cancel the link behavior            
	return false;
}



function buttonsOn()
{
	$('#hover_next_button').bind('click.buttonNamespace', nextButtonClick);
	$('#hover_prev_button').bind('click.buttonNamespace', prevButtonClick);
}

function buttonsOff()
{
	$('#hover_next_button').unbind('click.buttonNamespace');
	$('#hover_prev_button').unbind('click.buttonNamespace');
}

function showInfo()
{
	var headline = $(campaignData).find('campaign').eq(currentSlideIndex).find('headline').text();
	var body = $(campaignData).find('campaign').eq(currentSlideIndex).find('body').text();
	var link = $(campaignData).find('campaign').eq(currentSlideIndex).find('link').text();
	
	$('#info h1').text(headline);
	$('#info p').text(body);
	$('#info a').attr('href', link);

	$('#info').stop().fadeTo("fast", 1);
}

function hideInfo()
{
	trace('hiding info');
	$('#info').stop().fadeTo("fast", 0);
}

function handleEvent(e) {
	
	switch (e.data.msg)
	{
	
		case 'animation started' :
			buttonsOff();
			hideInfo();
		break;
		
		case 'animation complete' :
			buttonsOn();
			showInfo();
		break;
		
		default :
		
		break;
	
	}
}


function trace(s) { try { console.log("%s", s) } catch(e) {}
    
}

