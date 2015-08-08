//left menu code
var LeftSwipe = (function () {
    var menuEl = document.querySelector('.st-menu'),
    handleEls = document.querySelectorAll('.menu_button, .shadow, .left-edge-swiper, .st-menu'),
    isOpen = false,
    boundary = new Impulse.Boundary({ top: 0, bottom: window.innerHeight, left: 0, right: 300 }),
    menu = new Impulse(menuEl)
      .style('translate', function (x) {
          if (x <= 300) return x + 'px';
      }),
    drag = menu.drag({ handle: handleEls, boundary: boundary, direction: 'horizontal' });

    function end() {
        if (this.moved()) {
            isOpen = menu.direction('right');
            $(".shadow").addClass("visible");
            $(".content").addClass("collapse");
        } else {
            isOpen = !isOpen;
            if (isOpen) {
                menu.velocity(0, 4000);
            }
        }

        if (isOpen) {
            $(".st-menu").addClass("open");
            menu.accelerate({ acceleration: 2000 })
              .to(boundary.right, 0).start()
              .then(function () {
                  $(".shadow").addClass("visible");
                  $(".content").addClass("collapse");
              });
        } else {
            $(".st-menu").removeClass("open");
            $(".shadow").removeClass("visible");
            $(".content").removeClass("collapse");
            menu.spring({ tension: 70, damping: 15 })
              .to(boundary.left, 0).start();
        }
    }

    drag.on('end', end);
})();
//ripple animation code
var addMultiListener = function (el, events, callback) {
    // Split all events to array
    var e = events.split(' ');

    // Loop trough all elements
    Array.prototype.forEach.call(el, function (element, i) {
        // Loop trought all events and add event listeners to each
        Array.prototype.forEach.call(e, function (event, i) {
            element.addEventListener(event, callback, false);
        });
    });
};
addMultiListener(document.querySelectorAll('.clickable'), 'click tap vclick', function (e) {
    var ripple = this.querySelector('.ink');
    var eventType = e.type;
    /**
     * Ripple
     */
    if (ripple == null) {
        // Create ripple
        ripple = document.createElement('span');
        ripple.classList.add('ink');

        // Prepend ripple to element
        this.insertBefore(ripple, this.firstChild);

        // Set ripple size
        if (!ripple.offsetHeight && !ripple.offsetWidth) {
            var size = Math.max(e.target.offsetWidth, e.target.offsetHeight);
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
        }

    }

    // Remove animation effect
    ripple.classList.remove('animate');

    // get click coordinates by event type
    var x = e.pageX - this.offsetLeft - ripple.offsetWidth / 2;
    var y = e.pageY - this.offsetTop - ripple.offsetHeight / 2;

    // set new ripple position by click or touch position
    ripple.style.top = y + 'px';
    ripple.style.left = x + 'px';
    ripple.classList.add('animate');
});
//add shadow class after scroll
$('[class^="content-"]').scroll(function () {
    if (($(this).scrollTop() > 0)) {
        $(".title_bar").addClass("visible-bar");
    }
    else {
        $(".title_bar").removeClass("visible-bar");
    }
})
//batch data
var batch = [],
    batchnovalues = [];
$(".check").each(function (index) {
    batch.push($(this).text(), false);
    //store data in local cache
    batchnovalues.push({ "Name": $(this).text(), "Enrollment_No": $(this).data("info") });
});
//toggle check box
$(".check").on("vclick", function () {
    $(this).toggleClass("true icon-check icon-plus");
    if ($(this).hasClass("true")) {
        batch[batch.indexOf($(this).text()) + 1] = "true";
    }
    else {
        batch[batch.indexOf($(this).text()) + 1] = "false";
    }
});
//refresh button
$(".refresh_button").on("vclick", function () {
    location.reload();
});
//Search button , text box and back button handlers
$(".search_text").on("blur", function () {
    setTimeout(function () {
        cordova.plugins.Keyboard.close();
    }, 500);
});
$(".search_button").on("vclick", function () {
    search_click();
    //add nav state
    window.location = '#search';
});
$(".back_click").on("vclick", function () {
    back_search_click();
    //add nav state
    history.back();
    //window.location = '#';
});
//show / hide quick scroll buttons
//hide quick top on default load
$(".quick_scroll.top").fadeOut();
$(".content-user").on("scroll", function () {
    //top
    if ($(this).scrollTop() <= 25) {
        $(".quick_scroll.top").fadeOut();
    }
    else {
        $(".quick_scroll.top").fadeIn();
    }
    //bottom
    if (($(this).scrollTop() + $(this).innerHeight()) >= this.scrollHeight) {
        $(".quick_scroll.bottom").fadeOut();
    }
    else {
        $(".quick_scroll.bottom").fadeIn();
    }
});
//quick scroll triggers
$(".quick_scroll.top").on("vclick", function () {
    $('.content-user').animate({
        scrollTop: 0
    }, 500);
    $(this).fadeOut();
});
$(".quick_scroll.bottom").on("vclick", function () {
    //scroll time
    var scrolltime = 500;
    //quick scroll function
    $('.content-user table tbody tr').each(function (index) {
        if ($(this).position().top > $('.content-user').height()) {
            $('.content-user').animate({
                scrollTop: $('.content-user').scrollTop() + $(this).position().top - (2 * $(".sticky-head").height())
            }, scrolltime);
            return false;
        }
    })
});
//select the batch to continue marking the attendance
$("#select_batch").on("vclick", function () {
    //check if there is a single batch selected
    if (!($(".check").hasClass("true"))) {
        swal({
            title: "Error",
            text: "Please select atleast one batch to continue !",
            type: "error",
            confirmButtonColor: "#ee2525",
            allowOutsideClick: true
        })
    }
        //If not empty continue
    else {
        //try loading data from the webserver
        //no code for above written yet .. coming soon
        searchincache();
    }
    // Store Data
    localStorage.setItem("Batches", JSON.stringify(batchnovalues));
    localStorage.setItem("Details", JSON.stringify(Details));
    //var a = JSON.parse(localStorage.getItem("batches"));
    //alert(batchnovalues[0].name);
});
//look for the batches in the local cache
function searchincache() {
    //trying the local cache
    var batchdata = localStorage.getItem("Batches");
    if (batchdata == null) {
        //if cache is empty
        swal({
            title: "Error",
            text: "Please connect to the internet to update the cache!",
            type: "error",
            confirmButtonColor: "#ee2525",
            allowOutsideClick: true
        })
    }
    else {
        //not empty
        //remove the current window from the view
        $(".content-main").removeClass("visible");
        $(".expanding-overlay").removeClass("visible");
        //remove shadow class from title
        $(".title_bar").removeClass("visible-bar");
        //and add data
        $.each(Details, function (i, item) {
            $('.content-user table tbody').append("<tr><td><span class=\"ck\">" + item.Name + "</span></td>" + "<td><span class=\"ck\">" + item.Enrollment_No + "</span></td>" + "</tr>");
        });
        stickytable(".content-user table thead tr", ".content-user");
    }
}
//resize event
$(window).on("resize", function myfunction() {
    if (!($(".sticky-head").length == 0)) {
        //remove it and then add it
        $(".sticky-head").remove();
        stickytable(".content-user table thead tr", ".content-user");
    }
})
//sticky table header function
//function (the table head on which to add, the table's parent)
function stickytable(stickyobj, onobj) {
    //sticky table header
    var stickyheader = "<ul class=\"sticky-head\">";
    //add table headers
    $(stickyobj).each(function () {
        $(this).find('th').each(function () {
            //do your stuff, you can use $(this) to get current cell
            stickyheader += "<li style=\"width: "
            + $(this).outerWidth()
            + "px;\">"
            + $(this).text();
            + "</li>"
        })
    })
    stickyheader += "</ul>"
    //finally add it to the layout
    $(onobj).prepend(stickyheader);
    //table toggle absent
    $(".content-user table tr").on("vclick", function () { //.content-user table td
        $(this).toggleClass("absent");
        var data = $(this).children(":last-child").text(),
            index = absent.indexOf(data);
        if (index > -1) {
            //remove if present
            absent.splice(index, 1);
        }
        else {
            //if not present
            absent.push(data);
        }
    });
}
//array to store absent children's enrollment number
var absent = [];
//save attendance
$(".half-buttons.save").on("vclick", function () {
    swal({
        title: "Saved",
        text: "The attendance has been marked",
        type: "success",
        confirmButtonColor: "#25ee60",
        allowOutsideClick: true
    })
});
$(".half-buttons.cancel").on("vclick", function () {
    swal({
        title: "Cancelled",
        text: "The attendance has not been marked!",
        type: "error",
        confirmButtonColor: "#ee2525",
        allowOutsideClick: true
    })
    location.reload();
});
//tooltips
$('.ttip').on("taphold", function () {
    //set tooltip 
    /*
     * myh,myv are the tooltip's horizontal and vertical positions
     * th,tv are the elements
     * here we are referring to tooltip[] as text,myh,myv,th,tv
     */
    var tooltip = $(".tooltip");
    //get data
    var data = $(this).data("tooltip").split(",");
    //set data
    tooltip.text(data[0]);
    //if tooltip already not set
    if (tooltip.hasClass('puff')) {
        tooltip.removeClass('puff');
    }
    tooltip.removeAttr('style');
    //set position
    $(tooltip).position({
        my: data[1].replace(" ", "") + " " + data[2].replace(" ", ""),
        at: data[3].replace(" ", "") + " " + data[4].replace(" ", ""),
        of: $(this)
    });

    //display tooltip and remove it
    tooltip.finish().addClass('puff').delay(4300).queue(function (next) {
        $(this).removeClass("puff");
        next();
    });;
});


//Student Details -- The check page
$("#check-button").on("vclick", function () {
    //if empty
    if (($("#username").val().length <= 0) && ($("#fromdate").val().length <= 0) && ($("#todate").val().length) && (!($(".content-check").hasClass("flash")))) {
        $(".content-check input").addClass("flash")
        .delay(4000)
        .queue(function () {
            $(this).removeClass("flash");
            $(this).dequeue();
        });
    }//Check for validation
    else {
        //temp makeshift for mockup ! NOT THE ACTUAL CODE
        $(".content-check").removeClass("visible");
        $(".content-attendance").addClass("visible");        
        for (var i = 1; i < 20; i++) {
            $('.content-attendance span:nth-child(' + i + ') span').delay("700").animate({ width: ($('.content-attendance span:nth-child(' + i + ') span').data("percentage")) + '%' }, 500);            
        }
    }
});

//expand detailed view the expanding overlay used at various places
$(".content-attendance h2,.content-main .subject").on("vclick", function () {
    $(".expanding-overlay h3").text($(this).text());
    $(".expanding-overlay").addClass("visible");
});

$(".expanding-overlay h3").on("vclick", function () {
    $(".expanding-overlay").removeClass("visible");
});

//Clear text in Fields
$("#emptytext").on("vclick", function () {
    $("#username").val("");
});

//sidebar clicks
$("#profile").on("vclick", function () {
    profile_click();
})
$("#mark").on("vclick", function () {
    mark_click();
})
$("#check").on("vclick", function () {
    check_click();
})
$("#scan").on("vclick", function () {
    scan_click();
})
$("#feedback").on("vclick", function () {
    feedback_click();
})
$("#settings").on("vclick", function () {
    settings_click();
})
$("#help").on("vclick", function () {
    help_click();
})
$("#logout").on("vclick", function () {
    logout_click();
})
