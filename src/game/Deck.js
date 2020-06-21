export default class Deck {
  constructor() {
    this.cards = Deck.create();
    this.flipped = null;
  }
  
  static suits = ["S", "D", "C", "H"];
  static ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  
  static create() {
    let cards = [];
    for(let i = 0; i < Deck.suits.length; i++) {
      for(let j = 0; j < Deck.ranks.length; j++) {
        let suit = Deck.suits[i];
        let rank = Deck.ranks[j];
        let value = ((rank) => {
          switch(rank) {
            case "A":
              return 1;
            case "J":
            case "Q":
            case "K":
              return 10;
            default:
              return Number(rank);
          }
        })(rank)
        cards.push({suit, rank, value});
      }
    }
    return cards; 
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return this;
  }

}
