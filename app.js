// My TE App
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCmVArtQsZ0IvCIZMYnFv6cUKQyiKp9fVQ",
    authDomain: "fantasyteapp.firebaseapp.com",
    databaseURL: "https://fantasyteapp.firebaseio.com",
    projectId: "fantasyteapp",
    storageBucket: "",
    messagingSenderId: "951934559162"
};
firebase.initializeApp(config);

// connect to your Firebase application using your reference URL
let teAppReference = firebase.database();

let teAppPlayers = teAppReference.ref('Players');

// Create players array for API call from the db (Read the DB)

/* For some reason the resulting players array does not work in the forEach
let nflPlayers = [];

teAppPlayers.once('value').then(function(results) {
    let allPlayers = results.val();
    for (let player in allPlayers) {
        nflPlayers.push(allPlayers[player].urlName);
    };
})

console.log(nflPlayers);
*/


// Players Array

let nflPlayers = [
    'travis-kelce',
    'greg-olsen',
    // 'jimmy-graham',
    // 'kyle-rudolph',
    // 'zach-ertz',
    // 'delanie-walker',
    // 'dennis-pitta',
    // 'eric-ebron',
    // 'martellus-bennett',
    // 'jordan-reed',
    // 'cameron-brate',
    // 'coby-fleener',
    // 'jack-doyle',
    // 'hunter-henry'
];

let nflWeeks = {
    week1: [20160908, 20160911, 20160912],
    week2: [20160915, 20160918, 20160919],
    week3: [20160922, 20160925, 20160926],
    week4: [20160929, 20161002, 20161003],
    week5: [20161006, 20161009, 20161010],
    week6: [20161013, 20161016, 20161017],
    week7: [20161020, 20161023, 20161024],
    week8: [20161027, 20161030, 20161031],
    week9: [20161103, 20161106, 20161107],
    week10: [20161110, 20161113, 20161114],
    week11: [20161117, 20161120, 20161121],
    week12: [20161124, 20161127, 20161128],
    week13: [20161201, 20161104, 20161105],
    week14: [20161208, 20161211, 20161212],
    week15: [20161215, 20161217, 20161218, 20161219],
    week16: [20161222, 20161224, 20161225, 20161226]
}


/*
let teAppSeason = teAppReference.ref('Season');

// Trying to get an array inside of an array, but the nflWeeks array is saying it is undefined even though I'm pushing the arrays I want into it

let nflWeeks = [];

teAppSeason.once('value').then(function(results) {
    let season = results.val();
    for (let weeks in season) {
        console.log(season[weeks].days);
        nflWeeks.push(season[weeks].days);
    };
});

// console.log(nflWeeks[0]);
// console.log(nflWeeks.length);
*/

// Combined data sources to create dynamic API calls

let playerArray = [];

function getPlayersStats(week) {
    nflWeeks.week2.forEach(function(e) {
        nflPlayers.forEach(function(el) {
            $.ajax({
                url: 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2016-2017-regular/daily_player_stats.json?fordate=' + e + '&player=' + el, 
                headers: {
                    "Authorization" : 'Basic amZpa2U4OlBVTUEtYm9uZ28=',
                    // "Accept-Encoding" : "gzip"
                },
                success: function(result) {
                    let playerObject = {
                        playerName: el,
                        playerTargets: result.dailyplayerstats.playerstatsentry[0].stats.Targets['#text'],
                        playerReceptions: result.dailyplayerstats.playerstatsentry[0].stats.Receptions['#text'],
                        playerYards: result.dailyplayerstats.playerstatsentry[0].stats.RecYards['#text'],
                        playerTds: result.dailyplayerstats.playerstatsentry[0].stats.RecTD['#text']
                    };
                    playerArray.push(playerObject);
                },
                error: function() {
                    console.log('there was an error');
                }
            });
        });
    });
};

console.log(playerArray);

function playersToPage() { // the playerArray is empty when this runs
    playerArray.forEach(function(e) {
        let content = `
            <div data-id="${e.playerName}" class="row playerRow">
            <div class="col-md-2">Picture</div>
            <div class="col-md-2 player">${e.playerName}</div>
            <div class="col-md-2">Team</div>
            <div class="col-md-1">${e.playerTargets}</div>
            <div class="col-md-1">${e.playerReceptions}</div>
            <div class="col-md-1">${e.playerYards}</div>
            <div class="col-md-1">${e.playerTds}</div>
            <div class="col-md-1">Fantasy Points</div>
            <div class="col-md-1 star">Star</div>
            </div>
        `
        $('#main').append(content);
    });
};

// Week Event Listeners
$('#weeks-nav').on('click', '.weeks', function(e) {
    $('#main').html('');
    playerArray = [];
    let weekNumber = e.target.childNodes[0].data;
    getPlayersStats('week' + weekNumber);
})

// Open Login Window
$('#login').on('click', function() {
    $('#userPopUp').removeClass('hidden');
});

// Close Login Window with the X
$('.closePopUp').on('click', function() {
    $('#userPopUp').addClass('hidden');
    $('#favPlayerPopUp').addClass('hidden');
});

//  CRUD
/*C - Create Account

(/) on click of #login, show user popup
(/) On submit of username, store username in database (open question on how to recall the information from the db)
(/) Display username in top right of page
*/

// Submit user information (how to recall the user information from the db? - look up firebase SDK on how to look up the record with a specific username)

let teAppUser = teAppReference.ref('Users');

$('#createUser').on('click', function() {
    let user = {
        username: $('#initialUsername').val(),
        firstName: $('#initialFirstName').val(),
        favTeam: $('#initialFavTeam').val(),
        favPlayers: ['Your Favorite Players']
    }
    $('#initialUsername').val('');
    $('#initialFirstName').val('');
    $('#initialFavTeam').val('');
    let userReference = teAppUser.push(user);
    // set username on page
    $('#login').html(user.username)
            .attr('data-id', userReference.key);
});

/* R - Read favorite players

on click of fav players, read favorite player list from db and display in fav players popup
on click of username, display user information from db in user popup
*/

$('#favPlayersButton').on('click', function() {
    $('#favPlayers').html('');
    $('#main').addClass('hidden');
    $('#favPlayerPopUp').removeClass('hidden');
    let currentUser = $('#login').attr('data-id');
    teAppReference.ref('Users/' + currentUser + '/favPlayers').once('value', function(result) {
        let favPlayersArray = result.val();
        favPlayersArray.forEach(function(e) {
            $('#favPlayers').append('<li>' + e + '</li>');
        }); 
    });
})


/* U - Update username information

on click of star, display different color star
on click of star, store player in database under user

on click of username, display user information w/ option to update
on submit of update, update user in db
*/

// on click of star, store player in database under user
$('#main').on('click', '.star', function(e) {
    $(e.target).html('<strong>Star</strong>');
    let player = $(e.target.parentNode).attr('data-id');
    let currentUser = $('#login').attr('data-id');
    updateFavPlayers(currentUser, player);
})

function updateFavPlayers(user, player) {
    // get user's current players
    teAppReference.ref('Users/' + user + '/favPlayers').once('value', function(result) {
        let favPlayersArray = result.val();
        let manipulationArray = favPlayersArray
        manipulationArray.push(player);
        console.log(manipulationArray);
        teAppReference.ref('Users/' + user + '/').update({
            favPlayers : manipulationArray
        });
    });
};

/* Remove favorite players
$('#favPlayers').on('click', 'span', function(e) {
    console.log(e.target.parentNode);
    // let deletedPlayer = this.html();
    // console.log(deletedPlayer);
});
*/

/* D - Delete favorite player

on click of highlighted star/ trash can in favorite player popup, delete fav player entry in db
*/

$('#deleteUser').on('click', function(e) {
    e.preventDefault();
    let userId = $('#login').data();
    let userReference = teAppReference.ref('Users').child(userId.id);
    userReference.remove();
    // change DOM to show login again and remove favorite players
    $('#login').text('Login');
    $('#favPlayers').html('');
});



// Loader DOM

// Favorite Players DOM - consider creating the loader HTML contents so we can display the current user info







/* Notes

From inner combined data sources
                // console.log(player + ' Targets: ' + result.dailyplayerstats.playerstatsentry[0].stats.Targets['#text']);
                // console.log('Catches: ' + result.dailyplayerstats.playerstatsentry[0].stats.Receptions['#text']);
                // console.log('Yards: ' + result.dailyplayerstats.playerstatsentry[0].stats.RecYards['#text']);
                // console.log('TDs: ' + result.dailyplayerstats.playerstatsentry[0].stats.RecTD['#text']);
                // let targets = result.dailyplayerstats.playerstatsentry[0].stats.Targets['#text'];
                // console.log('Targets ' + targets);
*/

/* What is a better way to get this information into the datatase? - Yes create JSON object with all my data (I will be able to name things instead of the random id)

let player1 = {
    picture: 'img',
    displayName: 'Travis Kelce',
    urlName: 'travis-kelce',
    team: 'KC',
};

// teAppPlayers.push(player1);

let player2 = {
    picture: 'img',
    displayName: 'Greg Olsen',
    urlName: 'greg-olsen',
    team: 'CAR',
}

// teAppPlayers.push(player2);
*/

/* Attempt to creat player data array but don't want to store data in the Db as an array
let playerData = [
{
    picture: 'img',
    displayName: 'Travis Kelce',
    urlName: 'travis-kelce',
    team: 'KC',
},
{
    picture: 'img',
    displayName: 'Greg Olsen',
    urlName: 'greg-olsen',
    team: 'CAR',
}]

// Create the players array for API call from playerData array

let nflPlayers = [];

playerData.forEach(function(e) {
    nflPlayers.push(e.urlName);
});

console.log(nflPlayers);
*/

/* Stats of interest
    Targets: result.dailyplayerstats.playerstatsentry[0].stats.Targets['#text']
    Catches: result.dailyplayerstats.playerstatsentry[0].stats.Receptions['#text']
    Yards: result.dailyplayerstats.playerstatsentry[0].stats.RecYards['#text']
    TDs: result.dailyplayerstats.playerstatsentry[0].stats.RecTD['#text']
*/

/* Ajax call for daily stats
$.ajax({
    url: 'https://api.mysportsfeeds.com/v1.1/pull/nfl/2016-2017-regular/daily_player_stats.json?fordate=20161224&player=dwayne-allen', 
    headers: {
        "Authorization" : 'Basic amZpa2U4OlBVTUEtYm9uZ28=',
        // "Accept-Encoding" : "gzip"
    },
    success: function(result) {
        console.log(result);
    },
    error: function() {
        console.log('there was an error');
    }
});
*/