document.body.style.overflow = 'hidden';

let currentPokemon = null;
let timesUp = false;
var countDown = null;

var canvasWidth = 250;
var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;

var context = canvas.getContext("2d"),
    img = new Image();

var indexPokemon = getRandom(1, 150);

selectPokemon(indexPokemon).then((pokemon) => {

    timesUp = false;
    currentPokemon = pokemon;

    drawPokemon(`assets/img/pokemons/${pokemon.id}.png`, canvas, context, true);

    gelAllPokemonsNames().then((allNames) => {
        var options = createOptions(pokemon, allNames);
        showOptions(options);
        startCountDown();
    })

});

function showOptions(options) {

    let html = '';
    for (let i = 0; i < options.length; i++) {

        html += `<div class="inputGroup">
                    <input id="radio${i}" value="${options[i]}" name="radio" type="radio" onclick="checkAnswer(this.value)"/>
                    <label for="radio${i}">${options[i]}</label>
                </div>`;
    }

    document.querySelector("#options").innerHTML = html;
}

function startCountDown() {
    var timeleft = 8;
    countDown = setInterval(function () {
        document.querySelector("#timeLeft").value = --timeleft;
        
        if (timeleft <= 0){
            timesUp = true;
            clearInterval(countDown);
        }
            
    }, 1000);
}

function checkAnswer(answer) {
    if (answer.toUpperCase() === currentPokemon.name.toUpperCase()) {
        console.log("CORRECT!");
        clearInterval(countDown);
        drawPokemon(`assets/img/pokemons/${currentPokemon.id}.png`, canvas, context, false);
    } else {
        console.log("WRONG!");
    }
}

async function gelAllPokemonsNames() {
    let result = await fetch('https://pokeapi.co/api/v2/pokemon/');
    let pokemons = await result.json();

    return pokemons.results.map(x => x.name)
}

async function selectPokemon(indexPokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexPokemon}/`);
    const pokemon = await response.json();

    return pokemon;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawPokemon(imageUrl, canvas, ctx, doSilhouette) {
    var image = new Image();
    image.src = imageUrl;

    image.onload = function () {

        var newImgWidth = canvasWidth;
        var newImgHeight = image.height * (newImgWidth / image.width);

        canvas.height = newImgHeight;

        var imgX = 0;
        var imgY = 0;

        ctx.drawImage(image, imgX, imgY,
            newImgWidth, newImgHeight
        );

        if (!doSilhouette) return;

        var rawImage = ctx.getImageData(imgX, imgY, newImgWidth, newImgHeight);

        for (var i = 0; i < rawImage.data.length; i += 4) {
            if (rawImage.data[i + 3] >= 100) {
                rawImage.data[i] = 30;
                rawImage.data[i + 1] = 30;
                rawImage.data[i + 2] = 30;
                rawImage.data[i + 3] = 255;
            } else {
                rawImage.data[i + 3] = 0;
            }
        }

        ctx.putImageData(rawImage, imgX, imgY);


    };
}

function createOptions(pokemon, allNames) {
    let others = allNames.filter(x => x != pokemon.name);

    let index1 = getRandom(0, allNames.length);
    let index2 = getRandom(0, allNames.length);

    while (index1 == index2) {
        index2 = getRandom(0, allNames.length);
    }

    var options = [capitalize(allNames[index1]), capitalize(allNames[index2]), capitalize(pokemon.name)];

    return shuffle(options);
}

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1) };

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}