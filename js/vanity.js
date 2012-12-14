/* Vanity JS minified. Includes entire pack
 * Use this as a starting point for common jQuery features.
 * Includes:
 *	- jTip for tooltips
 *	- jSlider content slider
 *	- jPaginate for pagination
 *	- jSpotlight element highlighting
 *	- jPlaceholder form field placeholers
 *	- jCollapse JavaScript accordion
 *
 * Documentation: Each plugin is documented herein. See also: http://vanity.enavu.com/documentation/
 */

// jSlider Plugin for jQuery - Version 0.1
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jSlider() on the element you wish like so:
$(".slider").jSlider(); 

you can specify the following options:
previous_class = the class for the element that navigates to the previous item
next_class = the class that navigates to the previous item/slide
inactive = the class that will be set to the previous or next navigations when they are inactive
elem = the elements inside your slider content item, this can be li's if ur slider is a ul
animation = the animation is by default set to fade but if you include the custom_animations.js file you can use the following: slideDown, slideUp, slideRight, slideLeft, bounce, explode, fold, scale, random
easing = by default we use swing easing but if you included the custom_easing.js file you can use the following easing: linear, swing, jswing, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic, easeOutCubic, easeInOutCubic, easeInQuart, easeOutQuart, easeInOutQuart, easeInQuint, easeOutQuint, easeInOutQuint, easeInSine, easeOutSine, easeInOutSine, easeInExpo, easeOutExpo, easeInOutExpo, easeInCirc, easeOutCirc, easeInOutCirc, easeInElastic, easeOutElastic, easeInOutElastic, easeInBack, easeOutBack, easeInOutBack, easeInBounce, easeOutBounce, easeInOutBounce
speed = the speed of the animation
navi = true/false if you want to have the navigation list to shop up
navi_active_class = if navi is true you can choose a class to use for the navigation's active item
navi_class = if navi is true you can choose a class to use for the navigation itself
auto_slide = true/false to play the slider like a slide show
auto_slide_interval = time in milliseconds between slides
auto_pause_hover = if auto_slide is enabled you can choose whether to pause the slider when you hover with your mouse
click_next = true/false if you want to allow to go to next slide when you click on the slider
infinite = true/false infinite will make the slider infinite so when you are at the last slide you can click next and go back to the first slide and the same is true for the previous button
images = true/false if your slider uses an image for each slide enabling this will take that image and set it as the background of the slider so when the animation occurs it feels natural switching

*/
(function($){
    $.fn.jSlider = function(options) {
        var defaults = {
            previous_class: "prev",
			next_class: "next",
			inactive: "inactive",
			elem: "div",
			animation: "fade",
			easing: "swing",
			speed: 700,
			navi: true,
			navi_active_class: "active",
			navi_class: "navi",
			auto_slide: false,
			auto_slide_interval: 5000,
			auto_pause_hover: true,
			click_next: false,
			infinite: false,
			images: false
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            obj = $(this);
			var objChildren = obj.children(options.elem);
			var number_of_items = obj.children(options.elem).size();
			var prev = $("."+options.previous_class);
			var next = $("."+options.next_class);
			var items = [];
			var curr = 1;
			
			// create array of items
			for (i=1;i<=number_of_items;i++) { items[i] = obj.find(options.elem+":nth-child("+i+")"); }
			
			// initiate first slide
			slider(1, "", 1);
			
			// if auto slide is enabled
			if(options.auto_slide){
				//timer = setInterval("slider()", options.auto_slide_interval);
				var timer = setInterval(function(){ 
					if(curr < number_of_items) {
						slider(curr, "next", curr);
					} else {
						if (options.infinite) {
							slider(1, curr, number_of_items);
							curr = 1;
						}
					}
				}, options.auto_slide_interval);
			}
			
			// if auto pause on hover
			if(options.auto_slide && options.auto_pause_hover) {
				obj.children().hover(function(){
					clearInterval(timer);
				},function(){
					timer = setInterval(function(){ 
						if(curr < number_of_items) {
							slider(curr, "next", curr);
						} else {
							if (options.infinite) {
								slider(1, curr, number_of_items);
								curr = 1;
							}
						}
					}, options.auto_slide_interval);
				});
			}
			
			// if click_next is enabled
			if(options.click_next) {
				objChildren.click("click", function(e){
					e.preventDefault();
					if(curr < number_of_items) {
						slider(curr, "next", curr);
					} else {
						if (options.infinite) {
							slider(1, curr, number_of_items);
							curr = 1;
						}
					}
				});
			}
			
			// changing the item to be displayed
			function slider(page, direction, from) {
				if (direction == "next") { ++page; curr = page; }
				if (direction == "prev") { --page; curr = page; }
				obj.children(options.elem).hide();
				// custom animatoin library
				show(page, from);
				if (options.navi) createPagination(page);
				if (!options.infinite) {
					if (page == 1) {prev.addClass(options.inactive).css({"cursor":"default"});} else { prev.removeClass(options.inactive).css({"cursor":"pointer"}); }
					if (page == number_of_items) { next.addClass(options.inactive).css({"cursor":"default"}); } else { next.removeClass(options.inactive).css({"cursor":"pointer"}); }
				}
			}
			
			// create a navigation 
			function createPagination(curr) {
                $("."+options.navi_class).remove();
				var start, items = "", nav = "";
                start = "<ul class='"+options.navi_class+"'>";
                var end = "</ul>"
				for (i=1;i<=number_of_items;i++)
                {
					if (i == curr) { items += '<li><a class="'+options.navi_active_class+'" title="'+i+'">'+i+'</a></li>';} 
					else { items += '<li><a href="#" class="goto" title="'+i+'">'+i+'</a></li>';}
                }
                nav = start + items + end;
				obj.append(nav);
            }
			
			// custom animation library
			function show(page, from) {
				if (options.images) {
					if (number_of_items != 1) {				
						var img = items[from].find("img").attr("src");
						obj.css({"background":"url("+img+") center center"});
					}
				}
				if (options.animation == "random") {
					var randomation=["fade","slideDown","slideUp","slideRight","slideLeft","bounce","slideUp","explode","fold","scale"];
					var randomnumber=Math.floor(Math.random()*10)
					var animation = randomation[randomnumber];
				} else {
					var animation = options.animation;
				}
				objChildren.hide();
				switch (animation) {
					case "fade":
						items[page].stop().fadeIn(options.speed);
						break;
					case "slideDown":
						items[page].stop().show('slide', {direction: 'up', easing: options.easing}, options.speed);
						break;
					case "slideUp":
						items[page].stop().show('slide', {direction: 'down', easing: options.easing}, options.speed);
						break;
					case "slideRight":
						items[page].stop().show('slide', {direction: 'left', easing: options.easing}, options.speed);
						break;
					case "slideLeft":
						items[page].stop().show('slide', {direction: 'right', easing: options.easing}, options.speed);
						break;
					case "bounce":
						items[page].stop().show('bounce', {direction: "up", easing: options.easing}, options.speed);
						break;
					case "explode":
						items[page].stop().show('explode', {direction: "down", easing: options.easing}, options.speed);
						break;
					case "fold":
						items[page].stop().show('fold', {direction: "down", easing: options.easing}, options.speed);
						break;
					case "scale":
						items[page].stop().show('scale', {direction: "down", easing: options.easing}, options.speed);
						break;
					default:
						items[page].show();
						break;
				}
			}
			// controls
			$("."+options.next_class).live("click", function(e){
				e.preventDefault();
				if(curr < number_of_items) {
					slider(curr, "next", curr);
				} else {
					if (options.infinite) {
						slider(1, curr, number_of_items);
						curr = 1;
					}
				}
			});
			$("."+options.previous_class).live("click", function(e){
				e.preventDefault();
				if(curr > 1) {
					slider(curr, "prev", curr);
				 }else {
					if (options.infinite) {
						slider(number_of_items, curr, 1);
						curr = number_of_items;
					}
				}
			});
			$(".goto").live("click", function(e){
				e.preventDefault();
				var newy_curr = $(this).attr("title");
				if (newy_curr > curr) { slider(newy_curr, "", curr); } else { slider(newy_curr, "", curr); }
				curr = newy_curr;
			});
		});
    };
})(jQuery);

// jTabs Plugin for jQuery - Version 0.3
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jTabs() on the element that holds your tabs and pass in content for the element that holds your tabs content:
$("ul.tabs").jTabs({content: "content_class"}); 

you can specify the following options:
content = the element that will hold the divs with the content of each tab
equal_height = true/false to enable the columns to find the highest tab and set the height across all tabs
cookies = true/false will use browser cookies to store which tab the user is on
animate = true/false if you would like to use an animation effect when you switch tabs
effect = which animation effect would you like to use (default is fade) other option includes slide
speed = if you have animation to true you can choose how long to take the effect to take place

*/
(function($){
    $.fn.jTabs = function(options) {
        var defaults = {
            content: "div.content",
			equal_height: false,
			cookies: false,
			animate: false,
			effect: "fade",
			speed: 400
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            obj = $(this);
            
			var objTabs = $(options.content);
			var number_of_items = obj.children("li").size();
			var tabIndex = [];
			var tabs = [];
			
			
			// create array of tab index items
			for (i=1;i<=number_of_items;i++) { tabIndex[i] = obj.find("li:nth-child("+i+")"); tabIndex[i].attr("title", i); }
			
			// create array tabs
			for (i=1;i<=number_of_items;i++) { tabs[i] = $(options.content + "> div:nth-child("+i+")"); }
			
			// if equal height on
			if(options.equal_height) {
				var maxHeight = 0;
				$(options.content).children("div").each(function(){
				   if ($(this).outerHeight() > maxHeight) { maxHeight = $(this).outerHeight(); }
				});
				$(options.content).height(maxHeight);
			}
			
			// initiate the current tab
			if (options.cookies) {
				if (getCookie("page")) { showTab(getCookie("page")); }
				else { setCookie("page",1,999); showTab(1);	}
			} else {
				showTab(1);
			}
			
			function showTab(num) {
				tabIndex[num].addClass("active").siblings().removeClass("active");
				if(!options.animate) { tabs[num].show().siblings().hide(); }
				else {
				
					switch (options.effect) {
						case "fade":
							tabs[num].fadeIn(options.speed).siblings().hide();
							break;
						case "slide":
							tabs[num].slideDown(options.speed).siblings().hide();
							break;
					}
				
				}
			}
			
            
			obj.find("li").live("click", function(e){
				e.preventDefault();
				var tab_num = $(this).attr("title");
				showTab(tab_num);
				if (options.cookies) setCookie("page",tab_num,999);
			});
			
			
			/* code to handle cookies */
			function setCookie(c_name,value,expiredays)
			{
				var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);document.cookie=c_name+"="+escape(value)+
((expiredays==null)?"":";expires="+exdate.toUTCString());
			}
			function getCookie(c_name)
			{
				if(document.cookie.length>0)
				{c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1)
				{c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}
				return"";
			}
        });
        
       
    };
})(jQuery);

// jPaginate Plugin for jQuery - Version 0.3
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jPaginate() on the element you wish like so:
$("#content").jPaginate(); 

you can specify the following options:
items = number of items to have per page on pagination
next = the text you want to have inside the text button
previous = the text you want in the previous button
active = the class you want the active paginaiton link to have
pagination_class = the class of the pagination element that is being generated for you to style
minimize = minimizing will limit the overall number of elements in the pagination links
nav_items = when minimize is set to true you can specify how many items to show
cookies = if you want to use cookies to remember which page the user is on, true by default
position = specify the position of the pagination, possible options: "before", "after", or "both"
equal = implements an equal height main element by using the highest possible element use true false
offset = unfortunately calculating heights with javascript isn't always 100% accurate, so please use this value to make it perfect :) its defaultly set to 50

*/
(function($){
    $.fn.jPaginate = function(options) {
        var defaults = {
            items: 4,
            next: "Next",
            previous: "Previous",
            active: "active",
            pagination_class: "pagination",
            minimize: false,
            nav_items: 6,
			cookies: true,
			position: "after",
			equal: false,
			offset: 50
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            var obj = $(this);
            // this is how you call the option passed in by plugin of items
            var show_per_page = options.items;
            //getting the amount of elements inside parent element
            var number_of_items = obj.children().size();
            //calculate the number of pages we are going to have
            var number_of_pages = Math.ceil(number_of_items/show_per_page);
            
			//create the pages of the pagination
            var array_of_elements = [];
            var numP = 0;
            var nexP = show_per_page;
			
			var height = 0;
			var max_height = 0;
            //loop through all pages and assign elements into array
            for (i=1;i<=number_of_pages;i++)
            {    
                array_of_elements[i] = obj.children().slice(numP, nexP);
				
				if (options.equal) {	
					obj.children().slice(numP, nexP).each(function(){
						height += $(this).outerHeight(); 
					});
					if (height > max_height) max_height = height;
					height = 0;
				}
				
                numP += show_per_page;
                nexP += show_per_page;
            }
			if (options.equal) {	
				max_height += options.offset;
				obj.css({"height":max_height});
			}
			
			
            // display first page and set first cookie
			if (options.cookies == true) {
				if (get_cookie("current")) {
					showPage(get_cookie("current"));
					createPagination(get_cookie("current"));
				} else {
					set_cookie( "current", "1");
					showPage(get_cookie("current"));
					createPagination(get_cookie("current"));
				}
			} else {
				showPage(1);
				createPagination(1);
			}
            //show selected page
            function showPage(page) {
                obj.children().hide();
                array_of_elements[page].show();
            }
            
            // create the navigation for the pagination 
            function createPagination(curr) {
                var start, items = "", end, nav = "";
                start = "<ul class='"+options.pagination_class+"'>";
                var previous = "<li><a class='goto_previous' href='#'>"+options.previous+"</a></li>";
                var next = "<li><a class='goto_next' href='#'>"+options.next+"</a></li>";
				var previous_inactive = "<li><a class='inactive'>"+options.previous+"</a></li>";
                var next_inactive = "<li><a class='inactive'>"+options.next+"</a></li>";
                end = "</ul><br clear='all' />"
                var after = number_of_pages - options.after + 1;
                var pagi_range = paginationCalculator(curr);
				for (i=1;i<=number_of_pages;i++)
                {
                    if (options.minimize == true) {
						var half = Math.ceil(number_of_pages/2)
                    	if (i >= pagi_range.start && i <= pagi_range.end) {
							if (i == curr) { items += '<li><a class="'+options.active+'" title="'+i+'">'+i+'</a></li>';} 
                        	else { items += '<li><a href="#" class="goto" title="'+i+'">'+i+'</a></li>';}
						} else if (curr <= half) {
							if (i >= (number_of_pages - 2)) {
								if (i == curr) { items += '<li><a class="'+options.active+'" title="'+i+'">'+i+'</a></li>';} 
                        		else { items += '<li><a href="#" class="goto" title="'+i+'">'+i+'</a></li>';}
							} 
						} else if (curr >= half) {
							if (i <= 2) {
								if (i == curr) { items += '<li><a class="'+options.active+'" title="'+i+'">'+i+'</a></li>';} 
                        		else { items += '<li><a href="#" class="goto" title="'+i+'">'+i+'</a></li>';}
							}
						}
                    } else {
                        if (i == curr) { items += '<li><a class="'+options.active+'" title="'+i+'">'+i+'</a></li>';} 
                        else { items += '<li><a href="#" class="goto" title="'+i+'">'+i+'</a></li>';}
                    }
                }
                if (curr != 1 && curr != number_of_pages) {
                    nav = start + previous + items + next + end;
                } else if (number_of_pages == 1) {
					nav = start + previous_inactive + items + next_inactive + end;
				} else if (curr == number_of_pages){
                    nav = start + previous + items + next_inactive + end;
                } else if (curr == 1) {
                    nav = start + previous_inactive + items + next + end;
                }
				if (options.position == "before") {
					obj.before(nav);
				} else if (options.position == "after") {
					obj.after(nav);
				} else {
					obj.after(nav);
					obj.before(nav)
				}
                
            }
			
			/* code to handle cookies */
			/* code to handle cookies */
			function set_cookie(c_name,value)
			{
				var expiredays = 999;
				var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);document.cookie=c_name+"="+escape(value)+
((expiredays==null)?"":";expires="+exdate.toUTCString());
			}
			function get_cookie(c_name)
			{
				if(document.cookie.length>0)
				{c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1)
				{c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}
				return"";
			}
            
			function paginationCalculator(curr)  {
				var half = Math.floor(options.nav_items/2);
				var upper_limit = number_of_pages - options.nav_items;
				var start = curr > half ? Math.max( Math.min(curr - half, upper_limit), 0 ) : 0;
				var end = curr > half?Math.min(curr + half + (options.nav_items % 2), number_of_pages):Math.min(options.nav_items, number_of_pages);
				return {start:start, end:end};
			}
			
            // handle click on pagination 
            $(".goto").live("click", function(e){
                e.preventDefault();
                showPage($(this).attr("title"));
				set_cookie( "current", $(this).attr("title"));
                $(".pagination").remove();
                createPagination($(this).attr("title"));
            });
            $(".goto_next").live("click", function(e) {
                e.preventDefault();
                var act = "."+options.active;
                var newcurr = parseInt($(".pagination").find(".active").attr("title")) + 1;
                set_cookie( "current", newcurr);
				showPage(newcurr);
                $(".pagination").remove();
                createPagination(newcurr);
            });
            $(".goto_previous").live("click", function(e) {
                e.preventDefault();
                var act = "."+options.active;
                var newcurr = parseInt($(".pagination").find(".active").attr("title")) - 1;
				set_cookie( "current", newcurr);
                showPage(newcurr);
                $(".pagination").remove();
                createPagination(newcurr);
            });
        });
        
       
    };
})(jQuery);

// jSpotlight Plugin for jQuery - Version 0.1
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jHover() on the element you wish like so:
$("ul.hovered").jSpotlight(); 

you can specify the following options:
active = the class for the element that is currently hovered over
inactive = the class for the elements that are not hovered over when the main element is active
attr = the attribute inside the img to take the information for the title
title_class = the class of the title div which you can style
title_effect = the effect the title will have appearing and dissapearing, possible: slide, fade, default
title_speed = specify the speed of the effect in milliseconds or use slow/fast in quotes so like "slow"
title = here you can enable or disable the title effect by passing in true or false

*/
(function($){
    $.fn.jSpotlight = function(options) {
        var defaults = {
            active: "active",
            inactive: "inactive",
            attr: "title",
			title_class: "title",
			title_effect: "fade",
			title_speed: 300,
			title: true
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            var obj = $(this);
			// if titling is enabled add the title element to each of the children
			if (options.title) {
				obj.children().each(function(){
						var title_value = $(this).find("img").attr(options.attr);
						var title_dom_element = '<div class="'+options.title_class+'" style="display:none">'+title_value+'</div>';
						$(this).append(title_dom_element); 
				});
			}
			// Handle the hover event to apply one class/style to current and another to rest
        	obj.children().hover(function(e){ 
				// on mouse over
				$(this).siblings().removeClass(options.active).addClass(options.inactive);
				$(this).removeClass(options.inactive).addClass(options.active);
				// if title is enabled
				if (options.title) {
					switch(options.title_effect) {
					case "fade":
					  $(this).find("."+options.title_class).fadeIn(options.title_speed);
					  break;
					case "slide":
					  $(this).find("."+options.title_class).slideDown(options.title_speed);
					  break;
					default:
						$(this).find("."+options.title_class).show();
					}
				} 
			},function(){
				// on mouse leave
				$(this).removeClass(options.active).removeClass(options.inactive).siblings().removeClass(options.active).removeClass(options.inactive);
				// if title is enabled
				if (options.title) {
					switch(options.title_effect) {
					case "fade":
					  $(this).find("."+options.title_class).fadeOut(options.title_speed);
					  break;
					case "slide":
					  $(this).find("."+options.title_class).slideUp(options.title_speed);
					  break;
					default:
						$(this).find("."+options.title_class).hide();
					}
				} 
			});
		});
    };
})(jQuery);

// jTip Plugin for jQuery - Version 0.1
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jTip() on the element you wish like so:
$(".tip").jTip(); 

you can specify the following options:
attr = the attribute you want to pull the content from
tip_class = the class you want to style for the tip, make sure to have a width when styling
y_coordinate = the distance from the mouse the tip will show in the vertical direction
x_coordinate = the distance from the mouse the tip will show in the horizontal direction
*/
(function($){
    $.fn.jTip = function(options) {
        var defaults = {
            attr: "title",
			tip_class: "tip_window",
			y_coordinate: 20,
			x_coordinate: 20
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            var obj = $(this);
			//obj.css({"position":"relative"});
			
			$("body").append('<div class="'+options.tip_class+'" style="position:absolute; z-index:999; left:-9999px;"></div>'); 
			tObj = $("."+options.tip_class);
			var title_value = obj.attr(options.attr);
			
			obj.hover(function(e) {	
				
				tObj.css({opacity:0.8, display:"none"}).fadeIn(400);
				obj.removeAttr(options.attr);
				tObj.css({'left':e.pageX+ options.y_coordinate, 'top':e.pageY+ options.y_coordinate}).html(title_value);
				
				//fading in the tip
				tObj.stop().fadeTo('10',0.8);
				
			}, function(e) {
			
				//Put back the title attribute's value
				obj.attr(options.attr,title_value);
				//Remove the appended tooltip template
				tObj.stop().fadeOut(400);
				
			});
			obj.mousemove(function(e) {
				//Move the tip with the mouse while moving
				tObj.css({'top':e.pageY + options.y_coordinate,'left': e.pageX + options.y_coordinate});
			});

			
		});
    };
})(jQuery);

// jPlaceholder Plugin for jQuery - Version 0.2
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jPlaceholder() on the element you wish like so:
$("#content").jPlaceholder(); 

you can specify the following options:
css_class = allows you to specify the class for the placeholder
*/
(function($) {
$.fn.jPlaceholder = function(options) {
	var defaults = {css_class: "placeholder"};
	var options = $.extend(defaults, options);  
	// handle form being submitted by clearing the populated fields
	$("form").submit(function(){
		$("input").each(function(){
			if ($(this).attr("placeholder") != undefined) {
				if ($(this).attr("placeholder") == $(this).attr("value")) {	$(this).val(""); }
			}
		});
	});
	// loop through all the elements youve selected with the plugin
	this.each(function() {
		
		var phvalue = $(this).attr("placeholder");
		var currvalue = $(this).attr("value");
		
		if (phvalue != undefined) {
			
			if (phvalue == currvalue) {
				$(this).addClass(options.css_class);
			} else {
				$(this).removeClass(options.css_class);
			}
			if (currvalue == "") {
				$(this).addClass(options.css_class);
				$(this).val(phvalue);
			}
			$(this).focus(function(){
				if (phvalue == $(this).val()) {
					$(this).val("").removeClass(options.css_class);
				}
			});
			
			$(this).blur(function(){
				if ($(this).val() == "") {
					$(this).val(phvalue).addClass(options.css_class);
				}
			});
		}
	});
	return this;
	};
})(jQuery);


// jCollapse Plugin for jQuery - Version 0.3
// by Angel Grablev for Enavu Web Development network (enavu.com)
// Dual license under MIT and GPL :) enjoy
/*

To use simply call .jCollapse() on the element you wish like so:
$(".collapse").jCollapse(); 

you can specify the following options:
expand_text = the text that will expend the elements specified
collapse_text = the text that will replace the expand text once the elements have been shown
effect = this will be the effect that will change the way the new element/s show up, available options are: display, slide, fade

*/
(function($){
    $.fn.jCollapse = function(options) {
        var defaults = {
            expand_text: "Expand",
            collapse_text: "Collapse",
			effect: "display"
        };
        var options = $.extend(defaults, options);

        return this.each(function() {
            // object is the selected pagination element list
            var obj = $(this);
            // the expand text
            var expand_text = options.expand_text;
			// set the current element with the expand text no matter what
			obj.html(expand_text);
			// the collapse text
            var collapse_text = options.expand_text;
			// get the element we are collapsing 
			var obj_c = $(obj.attr("rel"));
			obj.click(function(e){
				e.preventDefault();
				if (obj.html() == expand_text) {
					obj.html(options.collapse_text);
					switch(options.effect) {
						case "display":
							obj_c.show();
							break;
						case "fade":
							obj_c.fadeIn("slow");
							break;
						case "slide":
							obj_c.slideDown("slow");
							break;
						default:
							obj_c.show();
					}
				} else {
					obj.html(options.expand_text);
					switch(options.effect) {
						case "display":
							obj_c.hide();
							break;
						case "fade":
							obj_c.fadeOut("slow");
							break;
						case "slide":
							obj_c.slideUp("slow");
							break;
						default:
							obj_c.hide();
					}
				}	
			});
		});
    };
})(jQuery);