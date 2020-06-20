export default class Deck {
  constructor() {
    this.cards = Deck.create();
    this.flipped = null;
  }
  
  static suits = ["S", "D", "C", "H"];
  static values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  
  static create() {
    let deck = [];
    for(let i = 0; i < Deck.suits.length; i++) {
      for(let j = 0; j < Deck.values.length; j++) {
        let card = {value: Deck.values[j], suit: Deck.suits[i]};
        deck.push(card);
      }
    }
    return deck; 
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    return this.deck;
  }

}