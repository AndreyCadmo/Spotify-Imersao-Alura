// Pesquisar artistas

const searchInput = document.getElementById('search-input');
const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById('result-playlists');

async function requestApi(searchTerm) {
    const url = `https://vercel-restful-api.vercel.app/artists?name_like=${searchTerm}`;
    var htmlArtist = await readHtml("./src/parts/artist.html");
    console.log(htmlArtist);

    resultArtist.innerHTML = '';
    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.length > 0) {
                for (const artist of result) {
                    let partNode = htmlArtist.cloneNode(true);
                    displayArtistInfo(artist, partNode);

                }

                validMusicIsPlaying();
                resultPlaylist.classList.add("hidden");
                resultArtist.classList.remove('hidden');
            } else {
                resultArtist.classList.add('hidden');
                resultPlaylist.classList.remove("hidden");
            }
        })
        .catch(error => console.error('Error:', error));


}

function displayArtistInfo(artist, partDoc) {
    const artistName = partDoc.getElementById('artist-name');
    const artistImage = partDoc.getElementById('artist-img');
    const artistGenre = partDoc.getElementById('artist-categorie');
    const playButton = partDoc.getElementById('playButton');

    artistName.innerText = artist.name;
    artistImage.src = artist.urlImg;
    artistGenre.innerText = artist.genre;

    const musicPath = artist.urlMusic;

    let musicName = musicPath.split("/").pop();
    playButton.id = `play-btn-${musicName}`;

    audio.addEventListener('ended', function () {
        playButton.innerHTML = '<span class="fa fa-solid fa-play"></span>';
    });

    playButton.addEventListener('click', function () {

        audioSource = audio.src.split("/").pop();
        console.log(audioSource !== musicName, audioSource, musicName)
        if (audioSource !== musicName) {
            audio.pause();
            audio.src = musicPath;
            toggleClassBtnMusic();
        }

        if (audio.paused) {
            audio.play();
            playButton.innerHTML = `<span class="fa fa-solid fa-pause"></span>`;
        } else {
            audio.pause();
            playButton.innerHTML = `<span class="fa fa-solid fa-play"></span>`;

        }
    });

    const grid = partDoc.getElementById('grid-container');
    resultArtist.append(grid);

}

const audio = new Audio();
function validMusicIsPlaying() {
    let audioSource = audio.src.split("/").pop();
    const currentPlay = document.getElementById(`play-btn-${audioSource}`);
    if (!!currentPlay) {
        console.log(currentPlay);
        toggleClassBtnMusic(currentPlay.children[0]);
    }
}

function toggleClassBtnMusic(currentPlay) {

    const buttonPlay = !!currentPlay ? currentPlay : document.getElementsByClassName("fa-pause")[0];
    if (!!buttonPlay) {
        buttonPlay.classList.toggle('fa-pause');
        buttonPlay.classList.toggle('fa-play');
    }
}

function debounce(func, timeout = 300) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, timeout);
    };
}

function searchInputFunc() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') {
        resultPlaylist.classList.remove('hidden');
        resultArtist.classList.add('hidden');
        return;
    }

    requestApi(searchTerm);
}

document.addEventListener('input', debounce(searchInputFunc));

// Bom dia/ Boa Tarde / Boa noite

document.addEventListener('DOMContentLoaded', function () {
    const saudacaoDiv = document.getElementById('saudacao');

    const horaAtual = new Date().getHours();

    let saudacao;
    if (horaAtual >= 0 && horaAtual < 5) {
        saudacao = 'Boa Madrugada';
    } else if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = 'Bom Dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = 'Boa Tarde';
    } else {
        saudacao = 'Boa Noite';
    }

    saudacaoDiv.textContent = saudacao;
});

async function readHtml(part) {

    var result = await fetch(part);
    var html = await result.text();

    var partDoc = new DOMParser().parseFromString(html, 'text/html');
    return partDoc;
}

