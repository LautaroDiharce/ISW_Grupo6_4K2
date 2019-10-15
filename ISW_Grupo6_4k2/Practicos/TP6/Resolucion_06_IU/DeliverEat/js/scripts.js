$(document).ready(function () {
    //Funcion para mostrar/ocultar las opciones seleccionadas por los radio buttons
    $('input[type="radio"]').click(function () {
        //validación para el método de pago
        if ($(this).attr("value") == "efeRBtn") {
            $(".efeRBtn").remove();//limpio el div
            //agrego el div correspondiente
            $("#ultimaFila").append('<div class="row efeRBtn"><div class= "col-md-6 mb-3"><label for="montoEfectivo">Con cuánto abonás?</label><input type="text" class="form-control" id="montoEfectivo" placeholder="" ><small class="text-muted">Ej: 200</small>');
            $(".visa").remove(); // remuevo el div no correspondiente a la opcion
        }
        if ($(this).attr("value") == "visa") {
            $(".visa").remove(); //limpio el div
            //agrego el div correspondiente
            $("#ultimaFila").append('<div class="row visa"><div class= "col-md-6 mb-3" ><label for="cc-name">Nombre del Titular</label><input type="text" class="form-control" id="cc-name" placeholder="" required><small class="text-muted">María del Valle de las Asturias</small></div><div class="col-md-6 mb-3"><label for="cc-number">Número de tarjeta</label><input type="text" class="form-control" id="cc-number" placeholder="" required><small class="text-muted">1234 4567 7891 4567</small></div></div><div class="row visa"><div class="col-md-3 mb-3"><label for="cc-expiration">Vencimiento</label><input type="text" class="form-control" id="cc-expiration" placeholder="" required><small class="text-muted">12/2024</small></div><div class="col-md-3 mb-3"><label for="cc-expiration">CVV</label><input type="text" class="form-control" id="cc-cvv" placeholder="" required><small class="text-muted">655</small></div></div>');
            $(".efeRBtn").remove(); // remuevo el div no correspondiente a la opcion

        }
        //validación para la fecha de envío
        if ($(this).attr("value") == "fechahs") {
            $(".envio").show('slow');
        }
        if ($(this).attr("value") == "asap") {
            $(".envio").hide('slow');
        }
        
    });
    //disparar el evento de click
    $('input[type="radio"]').trigger('click');

    //Función que agrega un producto (hardcodeado) al carrito
    $("#agregarItem").click(function () {
        $("#listaCarrito").append('<li class="list-group-item d-flex justify-content-between lh-condensed"><div><h6 class="my-0">Lomo Completo</h6><small class= "text-muted"> Lomo, queso, huevo, tomate, lechuga, mayonesa, jamón.</small></div><span class="text-muted precio">120</span></li >');
        calcularTotal();
    }
    );
    //Función para eliminar un elemento individual clickeado dentro del carrito
    $('#listaCarrito').on('click', 'li', function (e) {
        $(this).remove();
        calcularTotal();
    });
    //Función que borra TODOS los elementos del carrito
    $("#quitarItem").click(function () { $("#listaCarrito").find('li').remove(); calcularTotal(); });

    //Trigger inicial para el monto total del carrito
    $(calcularTotal);

    //Asociar evento de click del boton Enviar al comportamiento del formulario
    $("#Evniar").click(function () {
        enviarForm();
    });

    //función que inicializa el google maps
    initialization();

});

//Función de envío del formulario y notificación al usuario
function enviarForm() {
    valido = validarFormulario();
    if (valido) {
        alert("Pedido confirmado!");
    } else {
        alert("Datos erróneos, vuelva a ingresarlos!");
    }
}
//Definición de variable para validar los datos
var valido = false;
//Función para validar los datos del Form
function validarFormulario() {

    var forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
    });
    //Validar que por lo menos haya 1 elemento en el carrito
    if ($('#listaCarrito li').length === 0) {
        alert("Debe haber por lo menos 1 producto en el carrito!");
        return false;
    }
    //Retomo los inputs del form
    let direccion = document.querySelector("#direccion");
    let ciudad = document.querySelector("#ciudad");
    let fechahora = document.querySelector("#datetime");
    let efectivo = document.querySelector("#montoEfectivo");
    let ntarjeta = document.querySelector("#cc-name");
    let numtarjeta = document.querySelector("#cc-number");
    let nexp = document.querySelector("#cc-expiration");
    let ncvv = document.querySelector("#cc-cvv");
    let fechahs = document.querySelector("#datetime");
    //Chekeo si son válidos los campos y la selección en efectivo
    if (document.getElementById('efectivoRBtn').checked) {
        if (direccion.checkValidity() === true && ciudad.checkValidity() === true && fechahora.checkValidity() === true && efectivo.checkValidity() === true && fechahs.checkValidity() === true) {

            return validarMontoPago();
        }
        //Chekeo si son válidos los campos y a selección de tarjeta.
    } else if (document.getElementById('debitRBtn').checked) {
        if (direccion.checkValidity() === true && ciudad.checkValidity() === true && fechahora.checkValidity() === true && ntarjeta.checkValidity() === true && numtarjeta.checkValidity() === true && nexp.checkValidity() === true && ncvv.checkValidity() === true && fechahs.checkValidity() === true) {
            tarjVencida = validarFechaExpTarjeta();
            tarjValida = validarTarjetaVisa();
            if (tarjValida === true && tarjVencida === true) {
                return true;
            }
        } 
    }
    return false;
}
//Función para el cálculo del monto total del carrito.
function calcularTotal() {
    var sum = 0;
    // Iterar por cada elemento de la lista
    $(".precio").each(function () {

        var value = $(this).text();
        // Hacer la suma sólo si es un valor numérico
        if (!isNaN(value) && value.length != 0) {
            sum += parseFloat(value);
        }
    });
    //Asignar el valor al casillero del Total
    $('#totalCarrito').html('<strong> Total: $ ' + sum + '</strong>');
    document.getElementById("totalCarrito").setAttribute('value', sum);

}

function validarMontoPago() {
    var monto = document.getElementById("montoEfectivo").value;
    var totalAPagar = document.getElementById("totalCarrito").getAttribute('value');
    if (monto === "" || monto < totalAPagar) {
        return false;
    } else {
        return true;
    }
}

function validarFechaExpTarjeta() {
    var expiryDate = document.getElementById("cc-expiration").value;
    var today = new Date(); // gets the current date
    var today_mm = today.getMonth() + 1; // extracts the month portion
    var today_yy = today.getFullYear(); // extracts the year portion and changes it from yyyy 

    if (today_mm < 10) { // if today's month is less than 10
        today_mm = '0' + today_mm // prefix it with a '0' to make it 2 digits
    }

    var mm = expiryDate.substring(0, 2); // get the mm portion of the expiryDate (first two characters)
    var yy = expiryDate.substring(3); // get the yy portion of the expiryDate (from index 3 to end)

    if (yy > today_yy || (yy == today_yy && mm >= today_mm)) {
        // all good because the yy from expiryDate is greater than the current yy
        // or if the yy from expiryDate is the same as the current yy but the mm
        // from expiryDate is greater than the current mm
        return true;
    }
    else {
        alert("Tarjeta Vencida!");
        return false;
    }
}
//Validación de tarjeta Visa
function validarTarjetaVisa() {
    myCardNo = document.getElementById('cc-number').value;
    myCardName = 'Visa';
    if (checkCreditCard(myCardNo, myCardName)) {
        alert("Es una tarjeta Visa. Pago Aceptado!");
        return true;
    }
    else { alert(ccErrors[ccErrorNo]); return false; }
}
//Definicion de variables globales para el google maps
var latLng;
var zoom;
var map;
var marker;
//Función para actualizar el mapa
function updateMap() {
    //Set de la posicion en el mapa
    map.setCenter(latLng);
    //Set del marcador en el mapa
    marker.setPosition(latLng);
}
//Inicialización del Gmaps
function initialization() {
    
    //Constructor con los parametros de zoom, centro, tipo de mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { "lat": -31.424340, "lng": -64.184653 },
        mapTypeId: 'roadmap',
        zoom: 16,
    });
    //Constructor de latitud y longitud por defecto
    latLng = new google.maps.LatLng(-31.424340, -64.184653);
    //Inicializador del marcador con los parámetros de posicion, mapa y si es "arrastrable"
    marker = new google.maps.Marker({
        position: { "lat": -31.424340, "lng": -64.184653 },
        map: map,
        draggable: true
    });
    //Bindeo e inicialización del searchBox con el div direccion
    var searchBox = new google.maps.places.SearchBox(document.getElementById('direccion'));
    //Agregado del "escuchador" para cuando cambia el lugar en el searchBox de direcciones.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        //Variable para la toma del valor del searchBox
        var places = searchBox.getPlaces();
        //Si no hay nada en el search, retorno nada.
        if (places.length == 0)
            return;
        //Si hay algo en el search, busco los posibles lugares y luego seleccciono uno.
        for (var i = 0; place = places[i]; i++) {
            latLng = place.geometry.location;
        }
        //Actualizo el mapa luego del cambio.
        updateMap();
    });
        


    

}



