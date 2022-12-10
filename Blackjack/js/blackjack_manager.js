var game;
var debugMode = false;

function debug(an_object) {
	if (debugMode) {
		document.getElementById("debug").innerHTML = JSON.stringify(an_object);
	}
}

function new_game() {
	game = new BlackJack();
	cleanLayout();
	game.new_deck();
	player_play();
	dealer_play();
}

function player_play() {
	if (game.playerPass) {
		return;
	}
	game.player_move();
	insertCardFace("player", game.player_cards);
	verifyState(game.player_cards);
	if(game.getNumCards(game.player_cards) >1) document.getElementById("stand").disabled = false;
	let points = game.getPlayersPoints();
	printPoints(points);
}

function dealer_play() {
	game.dealer_move();
	insertCardFace("dealer", game.dealer_cards);
	verifyState(game.dealer_cards);
	let points = game.getPlayersPoints();
	printPoints(points);
}

function dealer_finish() {
	game.playerPass = true;
	document.getElementById("card").disabled = game.playerPass;
	dealer_play();
}

function printPoints(values){
	document.getElementById("dealer_point").innerHTML = values[0];
    document.getElementById("player_point").innerHTML = values[1];
}

function verifyState(hand) {
	let state = game.get_game_state(hand);
	debug(state);
	if (state.gameEnded) {
		finalize_buttons();
		if (state.dealerWon) {
			winPanel(false);
			document.getElementById("dealer").style.color = "#C5DB5F";
			document.getElementById("player").style.color = "#FF4200";
		} else {
			winPanel(true);
			document.getElementById("player").style.color = "#C5DB5F";
			document.getElementById("dealer").style.color = "#FF4200";

		}
	}
}

function winPanel(whoWin){
	let modal = document.getElementById("myModal");
	let span = document.getElementsByClassName("close")[0];
	document.getElementById("winnerModal").innerHTML = whoWin ? "<h1>...YOU!!! <br> Congratulations!!</h1>" : "<h1>...not You! <br> Try again!</h1>";
	modal.style.display = "block";
	span.onclick = function () {
		modal.style.display = "none";
	}
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}

function insertCardFace(name, hand) {
	let img = document.createElement("IMG");
	img.src = getCardFace(hand[hand.length - 1]);
	img.className = "stack";
	document.getElementById(name + "Group").appendChild(img);
}

function cleanLayout() {
	document.getElementById("dealer").style.color = "#000";
	document.getElementById("player").style.color = "#000";

	let elem = document.getElementById("playerGroup");
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}

	elem = document.getElementById("dealerGroup");
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}

	inicialize_buttons();
}

function getCardFace(num) {
	let card = new face_fetcher();
	return card.faces[num - 1][Math.floor(Math.random() * 4)];
}

function inicialize_buttons() {
	document.getElementById("card").disabled = false;
	document.getElementById("stand").disabled = true;
	document.getElementById("new_game").disabled = true;
}

function finalize_buttons() {
	document.getElementById("card").disabled = true;
	document.getElementById("stand").disabled = true;
	document.getElementById("new_game").disabled = false;
}
