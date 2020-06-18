var IS_LOGGED = false;
var USER_LAT = null;
var USER_LONG = null;

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
        //console.log('path changed to ' + _path);
        history.pushState(null, null, _path + window.location.search + window.location.hash);
    }
}

function getPath() {
    return window.location.pathname;
}

function open_chat(user_id) {
    //console.log("clicou em user" + user_id);
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

        //console.log("success");
        trending_loaded = true;
        $(".trending").slideDown("fast");
        $('#btn_trending').hide();
        $('#btn_trending_less').show();

    }).always(function () {
        //console.log("always");
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
    //console.log("sending: " + txt);
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
            //console.log('going back');
            window.history.back();
        }
    } else {
        //console.log('going back not mobile');
        window.history.back();
    }

}

function open_post(post_id) {
    if (!$('.pop-div-post').is(':visible')) {
        //console.log("abrindo post: " + post_id);
        $('#post_text').html('');
        $('#spinner_post_text').show();
        $('.pop-div-post').fadeIn();
        $('.pop-div-post').addClass("opened");
        $('body').addClass("msg-opened");
        changePath('/p/' + post_id + '/');

        $.getJSON("/api/post/" + post_id, function (data) {
            //console.log("success");

            $('#post_text').html(data.text);
            $('#spinner_post_text').hide();




        });



    }

}

function close_post() {
    if ($('.pop-div-post').is(':visible')) {
        //console.log('fecha post');
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
        //console.log(cs);
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
        //console.log("abrindo publish");
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
        //console.log('fecha publish');
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
var page = 1;
var date = null;

function load_main_posts_(){
    if (USER_LAT && USER_LONG) {
        $('#post_loading_btn').html("Carregando...");
        loading_content = true;
        if (!date) {
            var d = new Date($.now());
            date = (d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds());
        }
        $.getJSON("/api/post?requested_date=" + date + "&page=" + page + "&user_lat=" + USER_LAT + "&user_long=" + USER_LONG, function (data) {
            //console.log(data);
            var d = $('#main_posts');
            $.each(data, function (key, value) {
                d.append('<button class="list-group-item list-group-item-action bg-dark text-white purple-hover mb-3 text-break" onclick="open_post(' + value.id + ');">' + value.text + '</button>');
            });
            page++;
            //console.log("success");
        }).always(function () {
            //console.log("always");
            $('#post_loading_btn').html("Carregar mais");
            loading_content = false;
        }).fail(function () {
            //console.log("fail");
        });
    }
}

function load_main_posts() {
    if (!loading_content) {

        if (!USER_LAT || !USER_LONG) {
            getUserLocation(function success(lat, lon) {

                USER_LAT = lat;
                USER_LONG = lon;
                load_main_posts_();

            }, function error(msg) {
                USER_LAT = null;
                USER_LONG = null;
                alert(msg);
            });
        } else {
            load_main_posts_();
        }

        
    }
}

$("#post_loading_btn").click(function () {
    load_main_posts();
});

function infScrollControl(element) {
    //console.log("scrolling...");
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
        //console.log(this.files[0]);
        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
            //imageURI = e.target.result;
            decodeImageFromBase64(e.target.result, function (decodedInformation) {
                if (decodedInformation != "error decoding QR Code") {
                    //alert('Logando com: ' + decodedInformation);
                    user_login(decodedInformation);
                } else {
                    alert('error decoding');
                }

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

function downloadBase64Png(ImageBase64) {
    var a = document.createElement("a"); //Create <a>
    a.href = "data:image/png;base64," + ImageBase64; //Image Base64 Goes here
    a.download = "ticket.png"; //File name Here
    a.click(); //Downloaded file
}

function user_login(uid) {
    $.ajax({
            url: "/login",
            type: 'POST',
            data: {
                'uid': uid
            },
            beforeSend: function () {
                /*$('#get_qr_code').attr("disabled", true);
                $('#inputFile').attr("disabled", true);
                $('#get_qr_code').html("Gerando Códgo...");*/
            }
        })
        .done(function (data) {
            //alert('enviado');
            IS_LOGGED = true;
            $('#options_menu').append('<a class="dropdown-item" href="sair">SAIR</a>');
            $('#login_popup').remove();
            //alert('Logado!');
            setTimeout(function () {
                $('#loginModal').modal('hide');
            }, 1000);

        })
        .fail(function (jqXHR, textStatus, msg) {
            alert(msg);
            $('#loginModal').modal('hide');
        });
}

function create_user() {
    $.ajax({
            url: "/api/user",
            type: 'POST',
            data: {

            },
            beforeSend: function () {
                $('#get_qr_code').attr("disabled", true);
                $('#inputFile').attr("disabled", true);
                $('#get_qr_code').html("Gerando Códgo...");
            }
        })
        .done(function (data) {
            //alert('enviado');
            $('#get_qr_code').html("Pronto. Fazendo login...");
            //console.log(data);
            downloadBase64Png(data.ticket);
            //alert('Você será conhecido como: ' + data.user.name);
            //alert('Iniciando login para o código: ' + data.user.uid);
            user_login(data.user.uid);
            setTimeout(function () {
                //$('#loginModal').modal('hide');
            }, 1000);

        })
        .fail(function (jqXHR, textStatus, msg) {
            alert(msg);
        });
}

$("#get_qr_code").click(function () {
    create_user();
});

$('#loginModal').on('show.bs.modal', function (e) {
    //console.log("abriu modal");
    $('#get_qr_code').attr("disabled", false);
    $('#inputFile').attr("disabled", false);
    $('#get_qr_code').html("Não tenho código. É minha primeira vez aqui.");
    changePath('/login');
})

$('#loginModal').on('hide.bs.modal', function (e) {
    //console.log("fechou modal");
    $('#get_qr_code').html("Não tenho código. É minha primeira vez aqui.");
    changePath('/');
})

function publishControl() {

    var indexof = getPath().indexOf('/publish')
    if (indexof === 0) {
        //console.log('control abre publish');
        open_publish();

    } else {
        //console.log('control fecha publish');
        close_publish();

    }

}

function coordinatesToPlace(lat, lon) {
    url = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=pt';
    $.getJSON(url, function (data) {

        bairro = data.locality;
        cidade = data.city;

        //console.log("success place: " + bairro + ' - ' + cidade);
        $("#location").html(bairro + " - " + cidade);

    }).fail(function () {
        //console.log('Erro ao obter bairro e cidade');
    }).always(function () {
        $('#location_spinner').hide();
        $('#loc_loaded_div').show();
        $('#confirm_publish').attr("disabled", false);
    });

}

function getUserLocation(callback_success, callback_error) {
    if ("geolocation" in navigator) { //check geolocation available 
        navigator.geolocation.getCurrentPosition(function success(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            callback_success(lat, lon);

        }, function error(err) {

            callback_error('Erro ao obter localização (' + err.code + '): ' + err.message);

        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        callback_error("Browser doesn't support geolocation!");

    }
}

$('#send_publish').click(function () {
    $('#loc_loaded_div').hide();

    $('#confirm_publish').html("Publicar");
    $('#confirm_publish').attr("disabled", true);
    $('#publishModal').modal('show');


    getUserLocation(function success(lat, lon) {
        $('input#lat').val(lat);
        $('input#lon').val(lon);
        //console.log(lat + " " + lon);
        $("#location").html(lat + " " + lon);
        coordinatesToPlace(lat, lon);
    }, function error(msg) {
        alert(msg);
    });

});

/*window.onbeforeunload = function() {
    return "Do you really want to leave our brilliant application?";
 };*/

$('#confirm_publish').click(function () {
    text = $("#publish_text").val();
    location_lat = $("input#lat").val();
    location_long = $("input#lon").val();

    //console.log(text + location_lat + location_long);


    $.ajax({
            url: "/publish",
            type: 'POST',
            data: {
                text: text,
                location_lat: location_lat,
                location_long: location_long
            },
            beforeSend: function () {
                $('#confirm_publish').attr("disabled", true);
                $('#confirm_publish').html("Enviando...");
            }
        })
        .done(function (msg) {
            //alert('enviado');
            $('#confirm_publish').html("Enviado!");
            setTimeout(function () {
                $('#publishModal').modal('hide');
                close_publish();
                $("#publish_text").val('');
            }, 1000);

        })
        .fail(function (jqXHR, textStatus, msg) {
            $('#publishModal').modal('hide');
            changePath('/login');
            loginControl();
        });
});

$('#btn_refresh').click(function () {
    //window.onbeforeunload = null;
    window.location.reload();
});