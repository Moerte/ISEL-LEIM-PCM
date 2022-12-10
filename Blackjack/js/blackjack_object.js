// pcm 20172018a Blackjack object
//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;

// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        this.deck = [];
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.playerPass = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        this.new_deck = () => {
            let deck = [];
            for (let i = 0; i < 13 * 4; i++) {
                deck.push(i % 13 + 1);
            }
            return deck;
        };

        this.shuffle = (deck) => {
            for (let i = 0; i < deck.length; i++) {
                let r = Math.floor(Math.random() * deck.length);
                let t = deck[i];
                deck[i] = deck[r];
                deck[r] = t;
            }

            return deck;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
        //this.deck = this.new_deck();

    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn(val) {
        this.playerPass = val;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) {
        let total = 0;
        let joker = false;

        for (let i = 0; i < cards.length; i++) {
            let value;
            if (cards[i] >= 11) {
                value = 10;
            } else if (cards[i] == 1) {
                value = 11;
                joker = true;
            } else {
                value = cards[i];
            }
            total += value;
        }
        // Joker value
        if (joker == true && total > 21) {
            total -= 10;
        }
        return total;
    }

    dealer_move() {
        this.dealer_cards.push(this.deck.pop());
        let total = this.get_game_state(this.dealer_cards);
    }

    player_move() {
        this.player_cards.push(this.deck.pop());
    }

    getPlayersPoints() {
        return [this.get_cards_value(this.dealer_cards), this.get_cards_value(this.player_cards)];
    }

    setGameState(gameState, delearState, playerState){
        this.state.gameEnded = gameState;
        this.state.dealerWon = delearState;
        this.state.playerBusted = playerState;
    }

    getNumCards(cards){
        return cards.length;
    }

    get_game_state(cards) {
        let result = this.get_cards_value(cards);
        let playerResults = this.getPlayersPoints();
        if ((result == 21 && this.playerPass) || (result > 21 && !this.playerPass) || ((result <= 21 && this.playerPass)&& result>playerResults[1] && this.playerPass)) {
            this.setGameState(true, true, false);
        }else if((result == 21 && !this.playerPass) || (result > 21 && this.playerPass)){
            this.setGameState(true, false, true);
        }
        return this.state;
    }
}

