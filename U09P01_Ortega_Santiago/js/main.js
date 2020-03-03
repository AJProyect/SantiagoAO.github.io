document.onload = llamdas();

var selectOption = "";
var allContent = $('#dataContent');
var selectedContent = $('#filteredContent');

function llamdas() {
    inptutAddEvents();
    getMarvelData();
}

/**
 * Añadir eventos a los inputs.
 */
function inptutAddEvents() {
    $('#characterOpt').click(function () {
        selectOption = 'characters';
    });

    $('#comicOpt').click(function () {
        selectOption = 'comics';
    });

    $('#searchInp').change(filteredSearch);
}


/**
 * Recogida de todos los personajes
 */
function getMarvelData() {

    var dataCharacter = [];
    $.ajax({
        url: 'https://gateway.marvel.com:443/v1/public/characters?apikey=9fb583ddab8f0da73c341063826d73d5',
        type: 'GET',
        dataType: 'JSON',
        beforeSend: function () {
            $('#spinner1').show();
        },
        complete: function () {
            $('#spinner1').hide();
        },
        success: function (response) {
            dataCharacter = response.data;

            var dataLen = dataCharacter.results.length;
            var listCharacter = dataCharacter.results;

            var cardList = [];
            var container = $('#dataContent');
            var paginatedC = $('#paginatedContent');

            for (var index = 0; index < dataLen; index++) {
                var divCard = $('<div class="card" style="width: 18rem; height: 25rem"></div');
                var pathImg = listCharacter[index].thumbnail.path + '.' + listCharacter[index].thumbnail.extension;
                var imgCard = $("<img src=" + pathImg + " class='card-img-top w-100 h-75'>");
                var divCBody = $('<div class="card-body"><h4 class="card-title">' + listCharacter[index].name + '</h4></div>');
                divCard.append(imgCard).append(divCBody);
                cardList.push(divCard);
            };
            paginacion(cardList, container, paginatedC);
        }
    });
}

/**
 * Busqueda de comics/personajes por texto filtrado.
 */
function filteredSearch() {

    var input = $('#searchInp').val();
    var urlSearch = "";

    switch (selectOption) {
        case 'characters':
            urlSearch = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=' + input + '&apikey=9fb583ddab8f0da73c341063826d73d5';
            break;
        case 'comics':
            urlSearch = 'https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=' + input + '&apikey=9fb583ddab8f0da73c341063826d73d5';
            break;
    }

    var dataSerach = [];

    $.ajax({
        url: urlSearch,
        type: 'GET',
        dataType: 'JSON',
        beforeSend: function () {
            $('#spinner2').show();
        },
        complete: function () {
            $('#spinner2').hide();
        },
        success: function (response) {
            $('#pagSelect').empty();
            dataSerach = response.data;

            if (response.data.results.length != 0) {
                var cardList = [];
                var container = $('#filteredContent');
                var paginatedC = $('#pagSelect');

                var dataLen = dataSerach.results.length;
                var listFiltered = dataSerach.results;

                if (selectOption == 'characters') {
                    for (var index = 0; index < dataLen; index++) {
                        var divCard = $('<div class="card"style="width: 18rem; height: 25rem" ></div');
                        var pathImg = listFiltered[index].thumbnail.path + '.' + listFiltered[index].thumbnail.extension;
                        var imgCard = $("<img src=" + pathImg + " class='card-img-top w-100 h-75'>");
                        var divCBody = $('<div class="card-body"><p class="card-title">' + listFiltered[index].name + '</p></div>');
                        divCard.append(imgCard).append(divCBody);
                        cardList.push(divCard);
                    };
                } else {
                    for (var index = 0; index < dataLen; index++) {
                        var divCard = $('<div class="card mx-5" style="width: 18rem; height: auto" ></div');
                        var pathImg = listFiltered[index].thumbnail.path + '.' + listFiltered[index].thumbnail.extension;
                        var imgCard = $("<img src=" + pathImg + " class='card-img-top w-100 h-75'>");
                        var divCBody = $('<div class="card-body"><p class="card-title">' + listFiltered[index].title + '</p></div>');

                        var cBodyText;
                        if (listFiltered[index].description != null) {
                            if (listFiltered[index].description.length > 20) {
                                cBodyText = $('<p class="card-text">' + listFiltered[index].description + '</p>');
                                cBodyText.shorten({
                                    "showChars": 20,
                                    "moreText": "Ver mas...",
                                    "lessText": "Ver menos...",
                                });
                            } else {
                                cBodyText = $('<p class="card-text">' + listFiltered[index].description + '</p>');
                            }
                        } else {
                            cBodyText = $('<p class="card-text">No description found</p>');
                        }
                        divCBody.append(cBodyText);
                        divCard.append(imgCard).append(divCBody);
                        cardList.push(divCard);
                    }
                }
                paginacion(cardList, container, paginatedC);
            } else {
                $('#pagSelect').append('<p>NO HAY RESULTADOS CON ESTA BÚSQUEDA</p>');
            }

        }
    })
}

function paginacion(content, container, paginatedContainer) {
    container.pagination({
        dataSource: content,
        pageSize: 4,
        callback: function (data, pagination) {
            // template method of yourself
            var html = template(data);
            paginatedContainer.html(html);
        }
    })
    $('.paginationjs').css('align-self', 'center');
};

function template(data) {
    var lista = $('<ul></ul>');
    lista.attr('style', 'list-style: none;');
    $.each(data, function (index, element) {
        var li = $('<li></li>');
        li.css('float', 'left')
        li.append(element)
        lista.append(li);
    });
    return lista;
}
