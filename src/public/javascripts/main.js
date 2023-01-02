class Card {
    constructor(suit, face) {
      this.suit = suit;
      this.face = face;
    }
  }
  
class Deck {
    static suits = ['♠', '♥', '♦', '♣'];
  
    constructor() {
      const f = suit => [..."A23456789XJQK"].map(val => {
        return new Card(suit, val === 'X' ? '10' : val);
      });
      this.deck = Deck.suits.map(f).flat();
    }
  
    shuffle() {
      // Fisher–Yates Shuffle from:
      // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
      let newIndex;
      let tempCard;
      for(let i = this.deck.length - 1; i > 0; i--) {
        newIndex = this.randInt(0, i - 1); 
        tempCard = this.deck[i];
        this.deck[i] = this.deck[newIndex];
        this.deck[newIndex] = tempCard;
      }
    }
  
    randInt(a, b) {
      return Math.floor(Math.random() * ((b - a) + 1)) + a;
    }

    deal() {
        return this.deck.pop();
    }
  }

const calculateHand = hand => {
    let total = 0;
    let numAces = 0;
    for(const ele of hand) {
      if (ele.face === 'A') {
        numAces++;    
      } else {
        total += isNaN(+ele.face) ? 10 : +ele.face;
      }
    }
    total += numAces * 11;
    while(numAces > 0 && total > 21) {
      total -= 10;
      numAces--;
    }
    return total;
}

function elt(type) {                                //For creating elements more easily
	const ele = document.createElement(type);
	// start at 1 or else we'll get the type argument!
	for (let i = 1; i < arguments.length; i++) {
		let child = arguments[i];
		if (typeof child === "string") {
			child = document.createTextNode(child);
		}
		ele.appendChild(child);
	}
	return ele;
    /* Example usage!

    const ul = elt('ul', elt('li', 'item one'), elt('li', 'item two'));
    ^<ul>
        <li>item one</li>
        <li>item two</li>
    </ul>

    document.body.appendChild(ul);

    */

}


//------------------cards stuff------------------//


function main(){

    let gamesPlayed = 0;
    let gamesWon = 0;

    const btn = document.querySelector('.playBtn');
    btn.addEventListener('click', function(evt) {
        evt.preventDefault();
        
        const start = document.querySelector('.start');
        start.addEventListener('click', function(evt) {
            this.style.display = 'none';
            startGame();
        });
    });

    function startGame(){

        const played = elt('h3', 'Games Played: '+gamesPlayed);
        played.setAttribute('id', 'played')
        const won = elt('h3', 'Games Won: '+gamesWon)
        /*
        document.body.appendChild(played);
        document.body.appendChild(won);
        */
       const score = elt('div', played, won);
       score.setAttribute('id', 'box')
       document.body.appendChild(score);

        const deck = new Deck();         //create a deck of cards
        deck.shuffle();                  //and shuffle
    
        /*
        //now to set top cards...
        const form = document.getElementById('startValues');
        const inputCards = form.value.split(/[ ,]+/);       //splits by comma and ignores white space s
        if(inputCards[0] !== ''){
            deck.deck.push(...inputCards.map(ele => ele = new Card('♠', ele)));    //add input cards as card objects!!
        }
        console.log(JSON.stringify(deck.deck));
        */

        //deal first hands... the dumb way! But whatever it works 
        let playerHand = [];
        let cpuHand = [];

        playerHand.push(deck.deal());
        cpuHand.push(deck.deal());
        playerHand.push(deck.deal());
        cpuHand.push(deck.deal());

        /*card data
        console.log(JSON.stringify(playerHand));
        console.log(JSON.stringify(cpuHand));
        console.log(JSON.stringify(deck.deck));
        */

        let cpuScore = calculateHand(cpuHand);
        let playerScore = calculateHand(playerHand);

        //Statuses to check if both player and cpu stand, which ends the game
        let playerStand = false;
        let cpuStand = false;

        const hands = elt('div', 
            elt('h2', 'CPU Hand - total: ', '?', 
                elt('ol', 
                    elt('li', cpuHand[0].face, cpuHand[0].suit), 
                    elt('li', '??'))), 
            elt('h2', 'Player Hand - total: ', JSON.stringify(playerScore), 
                elt('ol', 
                    elt('li', playerHand[0].face, playerHand[0].suit), 
                    elt('li', playerHand[1].face, playerHand[1].suit))));

        hands.id = "hands";
        document.body.appendChild(hands);

        /*
        <div>

            <h2>    CPU Hand
                <ol>
                    <li>card1</li>             
                    <li>card2</li>
                </ol>
            </h2>

            <h2>     Player Hand 
                <ol>
                    <li>card1</li>
                    <li>card2</li>
                </ol>
            </h2>

        </div>
        */
        //hit and stand buttons
        const hit = elt('button', 'hit');
        const stand = elt('button', 'stand');
        document.body.appendChild(hit);
        document.body.appendChild(stand);
        //Setup done. Actual game begins here   ----------

        function update(){

            document.body.innerHTML = '';
            document.body.appendChild(score);

            //---------CPU----------
            let cpuUpdate = elt('h2', 'CPU Hand - total: ? ', elt('ol'));  //only displaying first card
            cpuUpdate.id = 'cpuUpdate';
            cpuUpdate.appendChild(elt('li', cpuHand[0].face, cpuHand[0].suit))

            cpuHand.slice(1).forEach(card => {
                cpuUpdate.appendChild(elt('li', '??'))
            });
            //document.body.insertBefore(elt('h2', 'CPU Hand - total: ? '), hit);
            document.body.appendChild(cpuUpdate);

            //---------PLAYER--------
            let playerUpdate = elt('h2', 'Player Hand - total: ', JSON.stringify(playerScore), elt('ol'));
            cpuUpdate.id = 'playerUpdate';
            playerHand.forEach(card => {
                playerUpdate.appendChild(elt('li', card.face, card.suit))
            });
            document.body.appendChild(playerUpdate);
            document.body.appendChild(hit);
            document.body.appendChild(stand);
            
        }

        function cpuTurn(){
            if(cpuScore <= 16){                     //hits
                cpuHand.push(deck.deal());          //the deal
                cpuScore = calculateHand(cpuHand);  //calculate score
                update();
                if(cpuScore > 21){                  //check if over 21
                    console.log("CPU Loses!");      //cpu loses
                    gameOver(); 
                }
                else if(playerStand){
                    cpuTurn();                      //recursion woooo
                }
            }else{                                  //stands
                console.log("CPU Stands");            
                cpuStand = true;                    //set status
                if(playerStand === true){           //check if player already stood
                    gameOver();                     
                }
            }
        }

        function gameOver(){            //TODO: displays all cards and scores, prints winner

            //clear the screen
            document.body.innerHTML = '';
            document.body.appendChild(score);

            //display all cards and score
            let cpuDone = elt('ol');
            cpuHand.forEach(card => {
                cpuDone.appendChild(elt('li', card.face, card.suit))
            });
            document.body.appendChild(elt('h2', 'CPU Score: ', JSON.stringify(cpuScore)));
            document.body.appendChild(cpuDone);

            let playerDone = elt('ol');
            playerHand.forEach(card => {
                playerDone.appendChild(elt('li', card.face, card.suit))
            });
            document.body.appendChild(elt('h2', 'Your Score: ', JSON.stringify(playerScore)));
            document.body.appendChild(playerDone);

            let won = false;

            let gameOverText;
            if(cpuScore>21){
                gameOverText = 'CPU busts! You win! :D';
                won = true;
            }
            else if(playerScore>21){
                gameOverText = 'You bust! CPU wins. :(';
            }
            else if(cpuScore>playerScore){
                gameOverText = 'CPU wins. :(';
            }
            else if(playerScore>cpuScore){
                gameOverText = "You win! :D";
                won = true;
            }
            else{
                gameOverText = "Tie! :|";
            }
            const gameOverScreen = elt('h1', gameOverText);
            const restartBtn = elt('button', 'Play Again');
            document.body.appendChild(gameOverScreen);
            document.body.appendChild(restartBtn);
            
            //restart game
            restartBtn.addEventListener('click', function(evt){
                document.body.innerHTML = '';
                gamesPlayed++;
                if(won){
                    gamesWon++;
                }
                startGame();
            })
        }
        
        //event listeners for hit/stand
        hit.addEventListener('click', function(evt){
            playerHand.push(deck.deal());               
            playerScore = calculateHand(playerHand);
            update();
            if(playerScore>21){
                gameOver();
            }else{
                cpuTurn();
            }
        })

        stand.addEventListener('click', function(evt){
            playerStand = true;
            cpuTurn();
            gameOver();
        })
        
    }



}

document.addEventListener('DOMContentLoaded', main);