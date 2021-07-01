import drawImage from './drawing.js';
import Level from './level.js';
import Score from './score.js';

document.body.style.overflow = 'hidden';

var optionsHtmlContent =
    `<div id="options-cards" class="animated fadeInUp">
    <div id="options">
    </div>
</div>
<div id="success-card" hidden>
    <div id="correct-message">
        <p class="pokemon-name success">Yeah!</p>
        <br>
        <p class="pokemon-name success">It's <span id="pokemon_name"></span>!</p>
    </div>
    <a href="#" class="myButton" onclick="nextPokemon();">NEXT</a> 
</div>`;

let level;
let score;
let lifes = 3;
let currentPokemon = null;
let timesUp = false;
var countDown = null;

var canvasWidth = 250;
var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;

var context = canvas.getContext("2d"),
    img = new Image();

function showCurrentScore(score) {
    var currentScore = document.querySelector('#currentScore');
    currentScore.innerHTML = '';
    currentScore.appendChild(document.createTextNode(` ${score.current}/${score.maxScoreLevel}`));
}

function showLifes(lifes) {
    var content = '';
    for (var i = 0; i < lifes; i++) {
        content += '<img src="assets/img/life.png" alt="">';
    }
    document.querySelector('#lifesContainer').innerHTML = content;
}

function initGame() {

    level = new Level(2);
    score = new Score(level);

    showCurrentScore(score);
    showLifes(lifes);
    selectAndShowPokemon();
}

initGame();

function clearScreen() {
    document.querySelector('#options-content').innerHTML = '';
    context.clearRect(0, 0, canvas.width, canvas.height);
}

window.nextPokemon = function nextPokemon() {
    clearScreen();
    score.increaseCurrentScore();
    showCurrentScore(score);
    selectAndShowPokemon();
}

function selectAndShowPokemon() {
    document.querySelector('#options-content').innerHTML = optionsHtmlContent;

    var indexPokemon = getRandom(level.currentGenerations[0].init, level.currentGenerations[level.currentGenerations.length - 1].end);

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
}

function showOptions(options) {

    let html = '';
    for (let i = 0; i < options.length; i++) {

        html += `<div class="inputGroup">
                    <input id="radio${i}" value="${options[i]}" class="option" name="radio" type="radio" onclick="checkAnswer(this)"/>
                    <label for="radio${i}">${options[i]}</label>
                </div>`;
    }

    document.querySelector("#options").innerHTML = html;
}

function startCountDown() {
    var timeleft = 8;
    document.querySelector("#timeLeft").value = timeleft;
    countDown = setInterval(function () {
        document.querySelector("#timeLeft").value = --timeleft;

        if (timeleft <= 0) {
            timesUp = true;
            clearInterval(countDown);
        }

    }, 1000);
}

window.checkAnswer = function checkAnswer(option) {
    disableAllOptions();
    clearInterval(countDown);
    if (option.value.toUpperCase() === currentPokemon.name.toUpperCase()) {
        document.getElementById('pokemon_name').appendChild(document.createTextNode(currentPokemon.name.toUpperCase()));

        setTimeout(() => drawPokemon(`assets/img/pokemons/${currentPokemon.id}.png`, canvas, context, false), 360);


        flipCheckAnswerCard(true);

    } else {
        flipCheckAnswerCard(false);
        lifes--;
        showLifes(lifes);
    }
}

function disableAllOptions() {
    let options = document.getElementsByClassName('option');
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }
}

function flipCheckAnswerCard(isCorrect) {
    isCorrect ? isCorrectAnswerEffects() : isIncorrectAnswerEffects()
}

function isCorrectAnswerEffects() {
    var optionsCard = document.querySelector('#options-cards');

    optionsCard.classList.remove('animated');
    optionsCard.classList.remove('fadeInUp');
    optionsCard.classList.add('animated');
    optionsCard.classList.add('rollOut');

    setTimeout(() => {
        optionsCard.style.display = 'none';
        document.querySelector('#success-card').hidden = false;
        document.querySelector('#success-card').classList.add('flex-content');

        document.querySelector('#correct-message').classList.add('animated');
        document.querySelector('#correct-message').classList.add('tada');

        document.querySelector('.myButton').classList.add('animated');
        document.querySelector('.myButton').classList.add('fadeIn');
    }, 360);

    //optionsCard.addEventListener("animationend", () => {

    //});
}

function isIncorrectAnswerEffects() {
    var optionsCard = document.querySelector('#options-cards');

    optionsCard.classList.remove('animated');
    optionsCard.classList.remove('fadeInUp');
    optionsCard.classList.add('animated');
    optionsCard.classList.add('shake');
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
    drawImage(imageUrl, canvas, ctx, doSilhouette);
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