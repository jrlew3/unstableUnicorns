import defaultDeck from './cards.json';

export const editions = [
    "Base", 
    "RainbowApocalypse",
    "Apocalypse", 
    "UnicornsofLegend", 
    "Control",
    "Chaos"
]

export class CardData {
    constructor(data) {
        this.img = "/images/cards/"+data.img;
        this.name = data.name;
        this.type = data.type;
    }
}

export function getUnicorns(cards) {
    return cards.reduce((sum, card) => {
        if(card.includes("Ginormous Unicorn")) return sum+2; 
        else if (card.includes("Unicorn")) return sum+1;
        return sum;  
    }, 0);
}

export function loadDecks(editions) { 
    var cards = {}; 
    var decks = {
        nursery: [],
        deck: [],
        discard: [],
        turn: [],
        rules: [],
        "player-hand": ["Narwhal#0", ],
        "player-stable": ["Rhinocorn#0"],
        "player1-hand": ["Rhinocorn#1", "Rhinocorn#2"],
        "player1-stable": ["Rhinocorn#3"],
        "player2-hand": [],
        "player2-stable": ["Rhinocorn#4", "Rhinocorn#5"],
        "player3-hand": ["Rhinocorn#6"], 
        "player3-stable": [],
    }

    const ruleCard = defaultDeck[0]; 
    cards[ruleCard.name] = new CardData(ruleCard); 
    decks.rules = [ruleCard.name]; 

    for(const card of defaultDeck) {
        if (card.decks.some(edition => editions.includes(edition))) {
            cards[card.name] = new CardData(card); 

            if (card.type == "Baby Unicorn") {
                decks.nursery.push(card.name+"#1");
            } else {
                for (var i = 0; i < card.quantity; i++) {
                    decks.deck.push(`${card.name}#${i}`);
                }
            }
        }
    }

    decks.deck = shuffle(decks.deck);
    return {decks: decks, cards: cards};
}


export function getLabel(label) {
    label = label.replace("-", "'s ")
    return capitalize(label); 
}

export function capitalize(label) {
    const words = label.split(" ");
    
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(" ");; 
}


export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array; 
}

export const cardBack = "/images/back.png";
export const emptyCard = "/images/back.png";
export const unstable = "/images/unstable.png";
export const logo = "/images/logo.png";


