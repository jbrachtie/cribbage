// import { INVALID_MOVE } from 'boardgame.io/core';
import Deck from './Deck';
import { assignDealer, resetHands } from './helpers';

export const Cribbage = {
  setup: (ctx) => ({
    deck: new Deck(),
    board: [],
    players: Array(ctx.numPlayers).fill({
      hand: [],
      score: 0,
      dealer: false
    }),
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
      next: 'cribbing',
      onBegin: (G, ctx) => {
        // shuffle the deck
        G.deck = G.deck.shuffle()
        return G;
      },
      turn: {
        moveLimit: 1
      },
      moves: {
        selectCard: (G, ctx, index) => {
          // TODO: remove chosen from deck
          G.players[ctx.currentPlayer].hand.push(G.deck.cards[index])
        }
      },
      endIf: (G, ctx) => {
        return (ctx.turn > ctx.numPlayers);
      },
      onEnd: (G, ctx) => {
        // TODO: log for a tie
        G.players = assignDealer(G.players)
        G.players = resetHands(G.players);
      },
    },
    cribbing: {
      onBegin: (G, ctx) => {
        // shuffle deck, dealer deals 6 cards to each
        return G;
      },

      // in between:
      // each player chooses cards for the crib (dealer's)
      moves: {

      },

      // Ends the phase if this returns anything.
      endIf: (G, ctx) => {
        // once both players have selected their cards for the crib
      },

      onEnd: (G, ctx) => {
        // cut for flipped card
        return G;
      },

      next: 'pegging'
    },
    pegging: {
      onBegin: (G, ctx) => {
        // deal
        return G;
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