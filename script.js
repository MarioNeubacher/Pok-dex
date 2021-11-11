let pokemons;
allPokemons = [];

/**
 * Shows the functions in it, when the website is loaded
 */
function render() {
    loadScreen();
}

/**
 * Show the title screen
 */
function loadScreen() {
    document.getElementById('id-body').classList.add('stop-scroll');

    document.getElementById('id-loadScreen').innerHTML += `
        <div>
            <img class="img-pokedex" src="img/pokedex.png">
            <p class="text-loadPokedex" onclick="loadPokemons()">Load Pokédex</p>
        </div>
    `;
}

/**
 * Shows the pokemon or id entered in input
 */
function filterSearch() {
    let inputPokemon = document.getElementById('id-search').value;
    inputPokemon = inputPokemon.toLowerCase();

    if (inputPokemon == "") {
        document.getElementById('id-pokedex').innerHTML = ``;
        loadPokemons();
    } else {
        document.getElementById('id-pokedex').innerHTML = ``;

        for (let i = 0; i < allPokemons.length; i++) {
            let pokemonName = pokemons.results[i]['name'];
    
                if (CharactersOrIdOfInputAsAPI(inputPokemon, pokemonName, i)) {
                document.getElementById('id-pokedex').innerHTML += `
                    <div onclick='showPokemon(${JSON.stringify(allPokemons)}, ${i})' class="div-pokemons" id="id-card${i}">
                        <img class="img-pokemons" src="${allPokemons[i]['sprites']['other']['official-artwork']['front_default']}">
                        <p>#${allPokemons[i]['id']}</p>
                        <p class="text-headerPokemons">${pokemonName}</p>
                    </div>
                `;
                document.getElementById('id-card' + i).classList.add(allPokemons[i]['types'][0]['type']['name']);
                } 
        }
    }
}

/**
 * Gave condition meaning for clean coding
 * @returns - filters the variable 'pokemonName' and the array 'allPokemons' if input matches
 */
function CharactersOrIdOfInputAsAPI(inputPokemon, pokemonName, i) {
    return pokemonName.toLowerCase().startsWith(inputPokemon) || inputPokemon == allPokemons[i]['id'];
}

/**
 * Lists all pokemons
 */
async function loadPokemons() {
    document.getElementById('id-body').classList.remove('stop-scroll');
    document.getElementById('id-loadScreen').classList.add('d-none');
    document.getElementById('id-header').classList.remove('d-none');

    let url = 'https://pokeapi.co/api/v2/pokemon?limit=25&offset=0';
    let response = await fetch(url);
    pokemons = await response.json();

    for (let i = 0; i < pokemons['results'].length; i++) {
        let pokemonsUrl = await getPokemonUrl(pokemons['results'][i]['url']); /* always let */
        allPokemons.push(pokemonsUrl);
        let pokemonName = pokemons.results[i]['name'];

        document.getElementById('id-pokedex').innerHTML += `
            <div onclick='showPokemon(${JSON.stringify(pokemonsUrl)}, ${i})' class="div-pokemons" id="id-card${i}">
                <img class="img-pokemons" src="${pokemonsUrl['sprites']['other']['official-artwork']['front_default']}">
                <p>#${pokemonsUrl['id']}</p>
                <p class="text-headerPokemons">${pokemonName}</p>
            </div>
        `;
        document.getElementById('id-card' + i).classList.add(pokemonsUrl['types'][0]['type']['name']);
    }
}

/**
 * Necessary to form the variable which fetch the next API page
 * @param {object} url - API 
 * @returns - API as a string 
 */
async function getPokemonUrl(url) { 
    let response = await fetch(url);
    let pokemon = await response.json();
    return pokemon;
}

/**
 * Shows the clicked pokemon card in full screen
 * @param {string} pokemonsUrl - API string of each pokemon
 * @param {number} i - Tells which pokemon was selected 
 */
function showPokemon(pokemonsUrl, i) {
    document.getElementById('id-showPokemon').innerHTML = `
        <div onclick="closeFullscreen(event)" id="id-bg" class="div-pokemonOvercontainer">
            <div class="div-pokemon1">
                <div id="id-divPokemon2${i}" class="div-pokemon2">
                    <img class="img-pokemons" src="${pokemonsUrl['sprites']['other']['official-artwork']['front_default']}">
                    <p>#${pokemonsUrl['id']}</p>
                </div>
                <div class="text-pokemon">
                    ${pokemons.results[i]['name']}
                </div>
                <div id="id-types${i}" class="div-types">
                </div>
                <div class="div-types">
                    <div class="div-heightweight">
                        <p style="font-size: 20px">${pokemonsUrl['weight']}</p>
                        <p>Weight</p>
                    </div>
                    <div class="div-heightweight">
                        <p style="font-size: 20px">${pokemonsUrl['height']}</p>
                        <p>Height</p>
                    </div>
                </div>
                <table style="margin-left: 20px; width: calc(100% - 40px);">
                    <tbody id="id-stats"> 
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById('id-scrollToTop').classList.add('d-none');
    document.getElementById('id-divPokemon2' + i).classList.add(pokemonsUrl['types'][0]['type']['name']);
    showTypes(pokemonsUrl, i); /* Variable, weils bei jedem anders ist */
    showStats(pokemonsUrl);
}

/**
 * Shows the stats of the pokemon
 * @param {string} pokemonsUrl - API string of each pokemon
 */
function showStats(pokemonsUrl) {
    for (let y = 0; y < pokemonsUrl['stats'].length; y++) {
        let stats = pokemonsUrl['stats'][y]['stat']['name'];

        document.getElementById('id-stats').innerHTML += `
            <tr>
                <td style="width: 50px">${stats}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${pokemonsUrl['stats'][y]['base_stat']}" aria-valuemin="0" aria-valuemax="100" style="width: ${pokemonsUrl['stats'][y]['base_stat']}%">${pokemonsUrl['stats'][y]['base_stat']}</div>
                    </div>
                </td>
            </tr>
        `;
    }
}

/**
 * Shows the types of each pokemon
 * @param {string} pokemonsUrl - API string of each pokemon
 * @param {number} i - Tells which pokemon was selected 
 */
function showTypes(pokemonsUrl, i) {
    for (let x = 0; x < pokemonsUrl['types'].length; x++) { /* For-Schleife, weil Typenanzahl unterschiedlich */
        let types = pokemonsUrl['types'][x]['type']['name'];

        document.getElementById('id-types' + i).innerHTML += `
            <div id="id-color${x}" class="text-types">
                ${types}
            </div>
        `;
        document.getElementById('id-color' + x).classList.add(pokemonsUrl['types'][x]['type']['name']);
    }
}

/**
 * Closes full screen when clicked on the background
 * @param {string} event - Variable which compares to id 
 */
function closeFullscreen(event) {
    if (varialeMatchesId(event)) {
        document.getElementById('id-bg').classList.add('d-none');
    }
}

/**
 * Gave condition meaning for clean coding
 * @param {string} event - Variable which compares to id 
 * @returns - Result of the comparison between variable and id 
 */
function varialeMatchesId(event){
    return event.target.id == 'id-bg';
}

/**
 * Shows the arrow which leads to the top if scrolled past 250px
 */
window.onscroll = showBtn;

function showBtn() {
    if (scrolledPastCertainPixels()) {
        document.getElementById('id-scrollToTop').classList.remove('d-none');
    } else {
        document.getElementById('id-scrollToTop').classList.add('d-none');
    }
}

/**
 * Gave condition meaning for clean coding
 * @returns - Whether the certain pixels passed
 */
function scrolledPastCertainPixels(){
    return document.body.scrollTop > 250 || document.documentElement.scrollTop > 250;
}

/**
 * On click of the arrow image it jumps back to the top 
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}