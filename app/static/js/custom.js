var changeHash = function (hash) {
    history.pushState(null, null, window.location.pathname + window.location.search + hash);

}

var getHash = function () {
    return window.location.hash
}

function isMobile(size) {
    if (size == 'large') {
        return (window.matchMedia('(max-width: 767px)').matches)
    }
    return (window.matchMedia('(max-width: 575px)').matches)
}

var chat_state = 0; //closed = 0, first screen = 1, second screen = 2

function setChatState(x) {
    chat_state = x;
    if (isMobile()) {
        changeHash('#' + getChatState());
    }
}

function getChatState() {
    return chat_state;
}

var changePath = function (_path) {

    if (getPath() != _path) {
        console.log('path changed to ' + _path);
        history.pushState(null, null, _path + window.location.search + window.location.hash);
    }
}

function getPath() {
    return window.location.pathname;
}

function open_chat(user_id) {
    console.log("clicou em user" + user_id);
    $("#msg_list").hide();
    $("#msg_chat").show();
    var d = $('.msg-list .simplebar-content-wrapper');
    d.scrollTop(d.prop("scrollHeight"));
    setChatState(2);
}

function toggle_msg() {
    if ($(".pop-div-msg").is(":visible")) {
        hide_msg();
    } else {
        show_msg();
    }
}

function hide_msg() {
    $(".pop-div-msg").slideUp("fast", function () {
        if (!isMobile()) {
            $('#open_publish').animate({
                right: '10px'
            }, 'fast');
        }
    });
    $('body').removeClass("msg-opened");
    setChatState(0);
}

function show_msg() {
    if (!isMobile()) {
        $('#open_publish').animate({
            right: '310px'
        }, 'fast', function () {
            $(".pop-div-msg").slideDown("fast");
        });
    } else {
        $(".pop-div-msg").slideDown("fast");
    }

    $('body').addClass("msg-opened");
    setChatState(1);

}


var trending_loaded = false;

function more_trending() {
    if (trending_loaded) {
        $(".trending").slideDown("fast");
        $('#btn_trending').hide();
        $('#btn_trending_less').show();
        return;
    }
    $('#btn_trending').html("Carregando...");
    $.getJSON("/api", function (data) {

        var d = $('#trending_list');
        $.each(data.post_array, function (key, value) {
            d.append('<button class="list-group-item list-group-item-action trending">' + value.post_id + ' - ' + value.text + '</button>');
        });

        console.log("success");
        trending_loaded = true;
        $(".trending").slideDown("fast");
        $('#btn_trending').hide();
        $('#btn_trending_less').show();

    }).always(function () {
        console.log("always");
        $('#btn_trending').html("Ver mais");
    });
}


function less_trending() {

    $(".trending").slideUp("fast", function () {
        if (isMobile("large")) {
            var offset = $("#title_trending").offset();
            /*$("html,body").animate({
                scrollTop: offset.top,
                scrollLeft: offset.left
            });*/

            $(document).scrollTop(offset.top);
        }
    });
    $('#btn_trending').show();
    $('#btn_trending_less').hide();



}



function close_chat() {
    $("#msg_chat").hide();
    $("#msg_list").show();
    setChatState(1);
}

$("#back_to_list").click(function () {
    if (isMobile()) {
        press_back(mobile_only = true);
    } else {
        close_chat();
    }

});
$("#back_to_main").click(function () {
    if (isMobile()) {
        press_back(mobile_only = true);
    } else {
        hide_msg();
    }
});


$("#toggle-message").click(function () {
    toggle_msg();
});

$("#btn_trending").click(function () {
    more_trending();
});

$("#btn_trending_less").click(function () {
    less_trending();
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

$("#btn_send").click(function () {
    send_message();
});

window.onpopstate = function () {


    msgControl();
    publishControl();
    postControl();

    loginControl();
}

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

function press_back(mobile_only = false) {
    if (mobile_only) {
        if (isMobile()) {
            console.log('going back');
            window.history.back();
        }
    } else {
        console.log('going back not mobile');
        window.history.back();
    }

}

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
    close_post();
});

function postControl() {
    var indexof = getPath().indexOf('/p/')
    if (indexof === 0) {
        post_id = parseInt(getPath().substring(indexof + 3));
        open_post(post_id);
    } else {

        close_post();
    }
}

function msgControl() {
    if (isMobile()) {
        cs = getHash().substring(1);
        console.log(cs);
        if (cs == 0) {
            $(".pop-div-msg").slideUp("fast");
            $('body').removeClass("msg-opened");
            $('#open_publish').animate({
                right: '10px'
            }, 'fast');
        } else if (cs == 1) {
            //show msg
            $(".pop-div-msg").slideDown("fast");
            $('body').addClass("msg-opened");
            //go to 1st screen
            $("#msg_chat").hide();
            $("#msg_list").show();
            $('#open_publish').animate({
                right: '310px'
            }, 'fast');
        }
    }
}

function loginControl() {
    var indexof = getPath().indexOf('/login')
    if (indexof === 0) {
        $('#loginModal').modal('show');
    } else {
        $('#loginModal').modal('hide');
    }
}


function open_publish() {
    if (!$('.pop-div-publish').is(':visible')) {
        console.log("abrindo publish");
        $('.pop-div-publish').fadeIn();
        $('.pop-div-publish').addClass("opened");
        $('body').addClass("msg-opened");

        changePath('/publish');
        $('#open_publish').animate({
            bottom: '-60px'
        }, 'fast');
    }

}

function close_publish() {
    if ($('.pop-div-publish').is(':visible')) {
        console.log('fecha publish');
        $('.pop-div-publish').fadeOut();
        $('.pop-div-publish').removeClass("opened");
        $('body').removeClass("msg-opened");
        changePath('/');
        $('#open_publish').animate({
            bottom: '60px'
        }, 'fast');
    }
}

$("#close_publish").click(function () {
    close_publish();
});

$("#open_publish").click(function () {
    open_publish();
});






$(document).ready(function () {

    publishControl();

    postControl();

    load_main_posts();
    loginControl();


});


var loading_content = false;

function load_main_posts() {
    if (!loading_content) {
        $('#post_loading_btn').html("Carregando...");
        loading_content = true;
        $.getJSON("/api", function (data) {

            var d = $('#main_posts');
            $.each(data.post_array, function (key, value) {
                d.append('<button class="list-group-item list-group-item-action bg-dark text-white purple-hover mb-3 text-break" onclick="open_post(' + value.post_id + ');">' + value.text + '</button>');
            });

            console.log("success");
        }).always(function () {
            console.log("always");
            $('#post_loading_btn').html("Carregar mais");
            loading_content = false;
        }).fail(function () {
            console.log("fail");
        });
    }
}

$("#post_loading_btn").click(function () {
    load_main_posts();
});

function infScrollControl(element) {
    console.log("scrolling...");
    if ($(element).scrollTop() > $(document).height() - 4 * $(window).height()) {
        load_main_posts();
    }
}

$(document).scroll(function () {
    infScrollControl(this);
});

$('body').scroll(function () {
    infScrollControl(this);
});



function readFile() {
    if (this.files && this.files[0]) {
        console.log(this.files[0]);
        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
            //imageURI = e.target.result;
            decodeImageFromBase64(e.target.result, function (decodedInformation) {
                alert(decodedInformation);
            });
        });
        FR.readAsDataURL(this.files[0]);
    }

}

function decodeImageFromBase64(data, callback) {
    // set callback
    qrcode.callback = callback;
    // Start decoding
    qrcode.decode(data)
}

$('#inputFile').change(readFile);

$("#get_qr_code").click(function () {
    window.location.href = '/api/qr';
});

$('#loginModal').on('show.bs.modal', function (e) {
    console.log("abriu modal");
    changePath('/login');
})

$('#loginModal').on('hide.bs.modal', function (e) {
    console.log("fechou modal");
    changePath('/');
})

function publishControl() {

    var indexof = getPath().indexOf('/publish')
    if (indexof === 0) {
        console.log('control abre publish');
        open_publish();

    } else {
        console.log('control fecha publish');
        close_publish();

    }

}

function coordinatesToPlace(lat,lon){
    url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=pt';
    $.getJSON( url, function(data) {
        console.log( "success place" );
        console.log( data.locality );
        $("#location").html(data.locality + " - " + data.city);
      }).fail(function() {
         alert( "error" );
        }).always(function() {
          console.log( "always place" );
        });
    
}

$('#send_publish').click(function () {

    if ("geolocation" in navigator) { //check geolocation available 
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(position) {
            $("#location").html(position.coords.latitude + " " + position.coords.longitude);
            coordinatesToPlace(position.coords.latitude , position.coords.longitude)
            $('#publishModal').modal('show');
        };

        function error(err) {
            alert('Erro ao obter localização (' + err.code + '): ' + err.message);
        };

        navigator.geolocation.getCurrentPosition(success, error, options);



    } else {
        console.log("Browser doesn't support geolocation!");
    }

});