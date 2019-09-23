$(document).ready(function () {
    //Funcion para mostrar/ocultar las opciones seleccionadas por los radio buttons
    $('input[type="radio"]').click(function () {
        //validación para el método de pago
        if ($(this).attr("value") == "efe") {
            $(".efe").show('slow');
            $(".visa").hide('slow');
        }
        if ($(this).attr("value") == "visa") {
            $(".efe").hide('slow');
            $(".visa").show('slow');

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
    };

    ////Función para invalidar el envío del formulario si hay algun campo incorrecto
    //(function () {
    //    'use strict';
    //    window.addEventListener('load', function () {
    //        // Buscar todos los elementos que requieran validación
    //        var forms = document.getElementsByClassName('needs-validation');
    //        // Loop sobre los elementos y evitar el envío del formulario
    //        var validation = Array.prototype.filter.call(forms, function (form) {
    //            form.addEventListener('submit', function (event) {
    //                if (form.checkValidity() === false) {
    //                    event.preventDefault();
    //                    event.stopPropagation();
    //                } 
    //                if ($('#listaCarrito li').length === 0) {
    //                    alert("Debe haber por lo menos 1 producto en el carrito!");
    //                    return false;
    //                } 
    //                form.classList.add('was-validated');
                   
    //            }, false);
    //        });
    //    }, false);
        
    //})();

    $("#Evniar").click(function () {
        validar();

    });

    //función que inicializa el google maps
    initialization() 


    
});
function validar() {
    var forms = document.getElementsByClassName('needs-validation');
    // Loop sobre los elementos y evitar el envío del formulario
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                form.classList.add('noValido');
                event.preventDefault();
                event.stopPropagation();  
            }
            form.classList.add('was-validated');
            
        }, false);
    });
    if ($('#listaCarrito li').length === 0) {
        alert("Debe haber por lo menos 1 producto en el carrito!");
        return false;
    }
    a();
}
function a() {
    
    if ($("#userForm").hasClass("noValido")) {
        alert("nada");
    } else {
        alert("todo");
    }
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
    //Bindeo e inicialización del searchBox con el div address
    var searchBox = new google.maps.places.SearchBox(document.getElementById('address'));
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



