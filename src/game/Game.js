// import { INVALID_MOVE } from 'boardgame.io/core';
import Deck from './Deck';
import { 
  assignDealer,
  resetHands,
  deal 
} from './helpers';

export const Cribbage = {
  setup: (ctx) => ({
    deck: new Deck(),
    board: [],
    players: Array(ctx.numPlayers).fill({
      hand: [],
      score: 0
    }),
    dealer: 0,
    crib: []
  }),
  moves: {

  },

  playerView: (G, ctx, playerID) => G,

  endIf: (G, ctx) => {
    // a player reaches score of 121+
    if (G.players[ctx.currentPlayer].score >= 121) {
      return ({
        winner: ctx.currentPlayer
      });
    }
  },

  phases: {
    setup: {
      // initial game setup
      // shuffle and cut a fresh deck
      // each player chooses a random card
      // lowest card is the dealer of 1st hand
      start: true,
      onBegin: (G, ctx) => {
        // shuffle the deck
        G.deck = G.deck.shuffle();
      },
      turn: {
        moveLimit: 1
      },
      moves: {
        selectCard: (G, ctx, index) => {
          let selectedCard = G.deck.take(index);
          G.players[ctx.currentPlayer].hand.push(selectedCard);
        }
      },
      endIf: (G, ctx) => {
        return (ctx.turn > ctx.numPlayers);
      },
      onEnd: (G, ctx) => {
        // TODO: redo for a tie
        G.dealer = assignDealer(G)
        G.players = resetHands(G.players);
        // TODO: better way to put taken cards back into deck
        // instead of making a new one each time
        G.deck = new Deck();
      },
      next: 'cribbing',
    },
    cribbing: {
      onBegin: (G, ctx) => {
        // shuffle deck, dealer deals 6 cards to each
        G.deck = G.deck.shuffle();
        G = deal(G, ctx.numPlayers);
      },

      // in between:
      // each player chooses cards for the crib (dealer's)
      moves: {
        moveToCrib: (G, ctx, playerId, idxs) => {
          let cardsForCrib = []
          idxs.forEach(i => {
            cardsForCrib.push(G.players[playerId].hand[i]);
          });
          G.crib = [...G.crib, ...cardsForCrib];
          G.players[playerId].hand = G.players[playerId].hand.filter(card => {
            return !cardsForCrib.includes(card);
          });
        },
        cut: (G, ctx, index) => {
          // TODO make invalid for dealer
          let cut = G.deck.take(index);
          G.deck.cards.unshift(cut);
          G.deck.flipped = cut;
        }
      },
      endIf: (G, ctx) => {
        // once both players have selected their cards for the crib
        // or once flipped?
      },

      onEnd: (G, ctx) => {
        // check "2 for his heels"
        if (G.deck.flipped.rank === "J") {
          G.players[G.dealer].score += 2;
        }
      },

      next: 'pegging'
    },
    pegging: {
      onBegin: (G, ctx) => {
        // deal
      },

      moves: {

      },

      endIf: (G, ctx) => {
        // all players hands are empty
      },

      next: 'scoring',
    },
    scoring: {
      moves: {
        scoreHand: (G, ctx) => {

        },
        scoreCrib: (G, ctx) => {
          // only valid for dealer
        }
      },

      endIf: (G, ctx) => {
        // all players done scoring
      },

      onEnd: (G, ctx) => {
        // change dealer
        return G;
      },

      next: 'cribbing'
    },
  },
}