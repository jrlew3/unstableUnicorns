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

export function loadCards() {
    var cards = {}; 
    
    const ruleCard = defaultDeck[0]; 
    cards[ruleCard.name] = new CardData(ruleCard); 

    for(const card of defaultDeck) {
        cards[card.name] = new CardData(card); 
    }

    return cards; 
}

export function loadDecks(players, editions) { 
    var decks = {
        nursery: [],
        deck: [],
        discard: [],
        turn: [],
        rules: defaultDeck[0],
    }

    for(const card of defaultDeck) {
        if (card.decks.some(edition => editions.includes(edition))) {
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

    for(const player of players) {
        decks[player+"-hand"] = decks.deck.splice(0, 5); 
        decks[player+"-stable"] = [decks.nursery.shift()];
    }

    return decks;
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


