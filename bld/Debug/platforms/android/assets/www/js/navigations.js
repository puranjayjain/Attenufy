/*
 * Written by Puranjay Jain
 * Started On 22/10/2014
 * Navigation States
 * ! Requires : Jquery 1.xx or 2.xx
 */
//add classes to page states here
//run at runtime
nav();
//current window state
function hashstate() {
    var hashes = [];
    //return as pathname as /foo.html , hash as #bar
    hashes[0] = window.location.pathname;
    hashes[1] = $(location).attr('hash');
    return hashes;
}

//navigation function
function nav() {
    var hashes = hashstate();
    var pathname = hashes[0],// as /foo.html
        hash = hashes[1];// as #bar
    if (pathname.indexOf("/index.html") > -1) {
        index();
    }
    else if (pathname.indexOf("/main-teacher.html") > -1) {
        main_teacher();
    }

    //page index teacher
    function index() {
        switch (hash) {
            case "#login":
                login_click();
                break;
            default:
                close_login_click();
        }
        authredirect();
    }

    //page main teacher
    function main_teacher() {
        switch (hash) {
            case "#search":
                search_click();
                break;
            default:
                back_search_click();
        }
    }
};

//login page trigger
function login_click() {
    $(".content-main").addClass("close");
    $(".content-style-overlay").addClass("open");
    $(".content-style-overlay").addClass("active");
    setTimeout(function () {
        $(".content-style-overlay").removeClass("active");
    }, 850);
}

//close login page trigger
function close_login_click() {
    $(".content-main").removeClass("close");
    $(".content-style-overlay").removeClass("open");
}

//search menu trigger
function search_click() {
    var search_box = document.querySelector('.search_box');
    $(".search_box").addClass("search_visible");
    setTimeout(function () {
        $(".search_text").focus();
    }, 500);
    setTimeout(function () {
        cordova.plugins.Keyboard.show();
    }, 900);
}

//search menu close
function back_search_click() {
    $(".search_box").removeClass("search_visible");
    setTimeout(function () {
        cordova.plugins.Keyboard.close();
    }, 500);
}

//sidemenu post login navigation i.e. menu bar
function profile_click() {
    var chash = hashstate()[0];
    if (chash.indexOf("/Profile.html") == -1) {
        setTimeout(function () {
            window.location = "Profile.html";
        }
        , 550);
    }
}

function mark_click() {
    var chash = hashstate()[0];
    if (chash.indexOf("/main-teacher.html") == -1) {
        setTimeout(function () {
            window.location = "main-teacher.html";
        }
        ,550);
    }
}

function check_click(page) {
    var chash = hashstate()[0];
    if (chash.indexOf("/teacher-check.html") == -1) {
        setTimeout(function () {
            window.location = "teacher-check.html";
        }
        , 550);
    }
}

function scan_click(page) {
    var chash = hashstate()[0];
    if (chash.indexOf("/teacher-check.html") == -1) {
        window.location = "teacher-check.html";
    }
}

function feedback_click(page) {
    var chash = hashstate()[0];
    if (chash.indexOf("/teacher-check.html") == -1) {
        window.location = "teacher-check.html";
    }
}

function settings_click(page) {
    var chash = hashstate()[0];
    if (chash.indexOf("/teacher-check.html") == -1) {
        
    }
}

function help_click(page) {
    var chash = hashstate()[0];
    if (chash.indexOf("/teacher-check.html") == -1) {
        window.location = "teacher-check.html";
    }
}

function logout_click(page) {
    var chash = hashstate()[0];
    //clear the user
    localStorage.removeItem("Authenticate");
    navigator.app.exitApp();
}

//history change event
window.addEventListener('popstate', function (event) {
    nav();
});

//Auto redirect the authenticated user !!! change this code after some time
function authredirect() {
    var auth = localStorage.getItem("Authenticate");
    if (auth != null) {
        //jsonify it
        var usedata = JSON.parse(auth);
        //redirect according to user
        if (usedata[0].Type == "Teacher") {
            location.replace('main-teacher.html');
        }
    }    
}