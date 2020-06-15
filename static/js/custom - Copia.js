var changeHash = function (hash) {
    console.log('hash changed to ' + hash)
    history.pushState(null, null, window.location.pathname + window.location.search + hash);
}

var getHash = function () {
    return window.location.hash
}

var changePath = function (_path) {
    console.log('path changed to ' + _path)
    history.pushState(null, null, _path + window.location.search + getHash());
}


function open_chat(user_id) {
    console.log("clicou em user" + user_id);
    changeHash("#2");
    $("#msg_list").hide();
    $("#msg_chat").show();
    var d = $('.msg-list .simplebar-content-wrapper');
    d.scrollTop(d.prop("scrollHeight"));
}

function toggle_msg() {
    if ($(".pop-div-msg").is(":visible")) {
        hide_msg();
    } else {
        show_msg();
    }
}

function hide_msg() {
    changeHash("");
    $(".pop-div-msg").slideUp("fast");
    $('body').removeClass("msg-opened");
}

function show_msg() {
    changeHash("#1");
    $(".pop-div-msg").slideDown("fast");
    $('body').addClass("msg-opened");
}



function toggle_trending() {
    $(".trending").slideToggle("fast", function () {

        var offset = $("#btn_trending").offset();
        $("html,body").animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });

    });
}

function close_chat() {
    changeHash("#1");
    $("#msg_chat").hide();
    $("#msg_list").show();
}

$("#back_to_list").click(function () {
    press_back();

});
$("#back_to_main").click(function () {
    press_back();
});


$("#toggle-message").click(function () {
    toggle_msg();
});

$("#btn_trending").click(function () {
    toggle_trending();
});

function add_message_baloon(txt, side) {
    baloon = '<div class="card text-white border-primary bg-dark mw-75 d-table my-1 msg-' + side +
        '"><div class="card-body p-1"><p class="card-text">' + txt + '</p></div></div>';
    var d = $('.msg-list .simplebar-content-wrapper');
    d.append(baloon);
    d.scrollTop(d.prop("scrollHeight"));
}

function send_message() {
    txt = $("#txt_msg").val();
    if (!txt) {
        $("#txt_msg").focus();
        return;
    }
    console.log("sending: " + txt);
    if (true) {
        add_message_baloon(txt, "r");
        $("#txt_msg").val("");
        $("#txt_msg").focus();
    }
}

function press_back() {
    window.history.back();
}

$("#btn_send").click(function () {
    send_message();
});

/*window.onpopstate = function () {
    var hash = getHash();
    console.log("popstate hash: " + window.location.pathname + " <------> " + hash);
    if (hash == '') {
        hide_msg();
    } else if (hash == '#2') {
        close_chat();
    }


    postControl();
}*/

$("#txt_msg").click(function () {
    setTimeout(function () {
        var d = $('.msg-list .simplebar-content-wrapper');
        d.scrollTop(d.prop("scrollHeight"));
    }, 400);


});

$("#txt_msg").on('keypress', function (e) {
    if (e.which === 13) {
        send_message();
    }
});


function open_post(post_id) {
    if (!$('.pop-div-post').is(':visible')) {
        console.log("abrindo post: " + post_id);
        $('.pop-div-post').fadeIn();
        $('.pop-div-post').addClass("opened");
        $('body').addClass("msg-opened");
        changePath('/p/' + post_id + '/');
    }

}

function close_post() {
    if ($('.pop-div-post').is(':visible')) {
        console.log('fecha post');
        $('.pop-div-post').fadeOut();
        $('.pop-div-post').removeClass("opened");
        $('body').removeClass("msg-opened");
        changePath('/');
    }
}

$("#close_post").click(function () {
    press_back();
});

function postControl() {
    var indexof = location.pathname.indexOf('/p/')
    if (indexof === 0) {
        post_id = parseInt(location.pathname.substring(indexof + 3));
        open_post(post_id);
    } else {
        
        close_post();
    }
}


$(document).ready(function () {

    changeHash('');

    postControl();







});