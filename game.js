const game = {
    init: function () {
        game.canvas = document.getElementById('gameCanvas');
        game.context = game.canvas.getContext('2d');

        levels.init();
        loader.init();

        game.hideScreens();
        game.showScreen("gameStartScreen");
    },

    hideScreens: function () {
        const screens = document.getElementsByClassName('gameLayer');
        for (let screen of screens) {
            screen.style.display = 'none';
        }
    },

    hideScreen: function (id) {
        const screen = document.getElementById(id);
        screen.style.display = 'none';
    },

    showScreen: function (id) {
        const screen = document.getElementById(id);
        screen.style.display = 'block';
    },

    showLevelScreen: function () {
        console.log('showLevelScreen');
        game.hideScreens();
        game.showScreen('levelSelectScreen');
    },

    start: function(){
        console.log('game started!');
    }

}

const levels = {
    data: [
        {
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        },
        {
            foreground: 'desert-foreground',
            background: 'clouds-background',
            entities: []
        }
    ],

    init: function () {
        const levelSelectScreen = document.getElementById('levelSelectScreen');
        const buttonClickHandler = function () {
            game.hideScreen('levelSelectScreen');
            levels.load(this.value - 1);
        }
        let i = 1;
        for (let level of levels.data) {
            let button = document.createElement('input');
            button.type = 'button';
            button.value = i;
            button.addEventListener('click', buttonClickHandler);
            levelSelectScreen.appendChild(button);
            i++;
        }
    },

    load: function (number) {

        game.currentLevel = {number : number};
        game.score = 0;
        document.getElementById('score').innerHTML = 'Score: ' + game.score;
        let level = levels.data[number];

        game.currentLevel.backgroundImage = loader.loadImage('./images/backgrounds/' + level.background + '.png');
        game.currentLevel.foregroundImage = loader.loadImage('./images/backgrounds/' + level.foreground + '.png');

        game.slingshotImage = loader.loadImage('./images/slingshot.png'); 
        game.slingshotFrontImage = loader.loadImage('./images/slingshot-front.png');

        loader.onload = game.start;

    }
};

const loader = {
    loaded: true,
    loadedCount: 0,
    totalCount: 0,

    init: function () {
        let audio = document.createElement('audio');

        let mp3Support = oggSupport = false;
        if (audio.canPlayType) {
            mp3Support = "" || audio.canPlayType('audio/mpeg');
            oggSupport = "" || audio.canPlayType('audio/ogg; codecs="vorbis"');
        }

        loader.soundFileExt = oggSupport ? '.ogg' : mp3Support ? ".mp3" : undefined;

    },

    loadImage: function (url) {
        this.loaded = false;
        this.totalCount++;
        game.showScreen('loadingScreen');
        let image = new Image();
        image.addEventListener('load', loader.itemLoaded, false);
        image.src = src;
        return image;
    },

    soundFileExt: '.ogg',

    loadSound: function (url) {
        this.loaded = false;
        this.totalCount++;
        game.showScreen('loadingScreen');
        let audio = new Audio();
        audio.addEventListener('canplaythrough', loader.itemLoaded, false);
        audio.src = url + loader.soundFileExt;
        return audio;
    },

    itemLoaded: function (ev) {
        ev.target.removeEventListener(ev.type, loader.itemLoaded, false);

        loader.itemLoaded++;

        document.getElementById('loadingMessage').innerHTML = "Loaded "
            + loader.loadedCount
            + ' Of ' + loader.totalCount;

        if(loader.loadedCount === loader.totalCount){
            loader.loaded = true;
            load.loadedCount = 0;
            loader.totalCount = 0;
            game.hideScreen('loadingScreen');

            if(loader.onload){
                loader.onload();
                loader.onload = undefined;
            }
        }    

    }

}

window.addEventListener('load', function () {
    game.init();
})  