/**
 * Cuando el documento esta preparado carga algunos valores.
 */
$(document).ready(function () {
    if(document.getElementById("manu_auto").value == 0){
        document.getElementById("button_manual").setAttribute("disabled", "disabled");
    }
    if($("#type").width()===0){
        $("#auto_display").hide();
        $("#pause_continue").hide();
        document.getElementById("fade_auto_display").classList.add('disable');
        document.getElementById("fade_manual_display").classList.add('disable');
        document.getElementById("fade_manual_display").classList.add('disable');
    }else{
        document.getElementById("fade_manual_display").classList.add('disable');
    }
    var h = $(window).height();
    var w = $(window).width();
    $("body").height(h);
    $("body").width(w);
    showmsg();
});
/**
 * Cuando la ventana se reescala cambia las dimensiones del body para que la web sea responsive
 */
$(window).resize(function () {
    var focused = document.getElementById("manual_data");
    if(document.activeElement != focused){
        var h = $(window).height();
        var w = $(window).width();
        $("body").height(h);
        $("body").width(w);
    }

});
/**
 * Lectura de variables del servidor
 */
setInterval(function () {
    $("#readvals").load(document.URL + " #readvals");
    aplicarOutput("c_posicion", document.getElementById("c_posicionInput").value);
    positionAnimation();
    aplicarOutput("c_speed", document.getElementById("c_speedInput").value);
    aplicarOutputButton("ready", document.getElementById("readyInput").value);
    aplicarOutputButton("alarm", document.getElementById("alarmInput").value);
    aplicarOutputButton("svre", document.getElementById("svreInput").value);
    aplicarOutputButton("busy", document.getElementById("busyInput").value);
},500);

/**
 * Envio de datos al servidor
 * @param id del formulario del que vienen los datos.
 * @returns siempre falso para que la web no se recargue pero si que envien los datos.
 */
function request2server(idform) {
    var data = $("#"+idform).serialize();
    $.ajax({
        type:"POST",
        data: data,
        success: function(data){
            console.log('sent');
        },
        error: function () {
            console.log('error');
        }
    });
    return false;
}
/**
 * Muestra un mensaje de alerta que inpide usar la web hata aceptarlo
 */
function showmsg(){
    document.getElementById("fullfade").classList.remove('disable');
    document.getElementById("message").classList.remove('disable');
}

/**
 * Cierra el mensaje
 * @param id del formulario a enviar
 * @returns siempre false para que se envien los datos y no se recargue la web
 */
function closemsg(idform){ 
    request2server(idform); 
    document.getElementById("rearme").value = "0"; 
    setTimeout(function () { 
        request2server(idform); 
        document.getElementById("rearme").value = "1"; 
    },200); 
    document.getElementById("fullfade").classList.add('disable'); 
    document.getElementById("message").classList.add('disable'); 
    document.getElementById("animation_box").style.margin = "0 0 0 0"; 
    document.getElementById("manual_data").value = "1"; 
    return false; 
}

/**
 * Funcion que mueve la caja de simulacion
 */
function positionAnimation() {
    console.log("ANIMACION "+document.getElementById("c_posicionInput").value); 
    var x = parseInt(document.getElementById("c_posicionInput").value); 
    if(x >= 1 && x <= 500) {     
        var margin = x * 90 / 500; 
        document.getElementById("animation_box").style.margin = "0 0 0 " + (margin) + "%"; 
    }
}

/**
 *
 * @param id del formulario a enviar
 * @returns siempre false para que se envien los datos y no se recargue la web
 */
function positionButton(idform) { 
    var x = parseInt(document.getElementById("manual_data").value); 
    if(x >= 1 && x <= 500) { 
        request2server(idform); 
        document.getElementById("pos_x_mm_aceptar").value = "0"; 
        setTimeout(function () { 
            request2server(idform); 
            document.getElementById("pos_x_mm_aceptar").value = "1"; 
        },200);  
    } 
    return false; 
}

/**
 * Funcion que esconde y muestra elementos segun el tamaño de la pantalla y la opcion manual o automatico
 * @param elemento a esconder
 * @param elemento a mostrar
 * @param formulario a enviar
 * @returns siempre false para que se envien los datos y no se recargue la web
 */
function showhide(tohide, toshow,idform){
    request2server(idform);
    showmsg();
    var chance = $("#type").width();
    if (chance===0) {
        var element = document.getElementById("animation");
        if(element.classList.contains("animation_responsive")||toshow!="auto_display"){
            element.classList.remove("animation_responsive");
            $("#pause_continue").hide();
            document.getElementById("button_manual").setAttribute("disabled","disabled");
            document.getElementById("button_auto").removeAttribute("disabled");
        }else {
            element.classList.add("animation_responsive");
            $("#pause_continue").show();
            document.getElementById("button_manual").removeAttribute("disabled","disabled");
            document.getElementById("button_auto").setAttribute("disabled","disabled");
        }
        $("#"+tohide).hide();
        $("#"+toshow).show();
    } else {
        if (toshow === "control_manual") {
            document.getElementById("fade_manual_display").classList.add("disable");
            document.getElementById("fade_auto_display").classList.remove("disable");
            document.getElementById("button_manual").setAttribute("disabled","disabled");
            document.getElementById("button_auto").removeAttribute("disabled");
        }else {
            document.getElementById("fade_auto_display").classList.add("disable");
            document.getElementById("fade_manual_display").classList.remove("disable");
            document.getElementById("button_manual").removeAttribute("disabled","disabled");
            document.getElementById("button_auto").setAttribute("disabled","disabled");
        }
    }
    return false;
}

/**
 * Funcion que envia un valor en concreto sin formulario
 * @param id del boton que ha sido pulsado
 * @param nombre del boton que ha sido pulsado y variable a enviar al servidor
 */
function Pulse(idPulsador, namePulsador){
    if(document.getElementById(idPulsador).value != 1){
        document.getElementById(idPulsador).value = 1;
        request2serverPulsador(namePulsador, 1);
    }else{
        document.getElementById(idPulsador).value = 0;
        request2serverPulsador(namePulsador, 0);
    }
}

/**
 * Funcion que envia una unica variable sin necesidad de formulario
 * @param variable a enviar al servidor
 * @param valor a enviar al servidor
 * @returns siempre false para que se envien los datos y no se recargue la web
 */
function request2serverPulsador(nameVariable, value) {
    $.ajax({
        type:"POST",
        data:nameVariable+"="+value,
        success: function(data){
            console.log('sent');
        },
        error: function () {
            console.log('error');
        }
    });
    return false;
}
/**
 * Funcion que reflejara los cambios en el servidor
 * @param id del elemento en que se reflejaran los cambios en el servidor
 * @param valor del ervidor
 */
function aplicarOutput(ID, value){
    document.getElementById(ID).value=value;
}

/**
 * Igual que la anterior para botones
 */
function aplicarOutputButton(ID, value){
    if (value == 1) {
        document.getElementById(ID).style.backgroundColor = "red";
    }else{
        document.getElementById(ID).style.backgroundColor = "grey";
    }
}
