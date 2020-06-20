// import { INVALID_MOVE } from 'boardgame.io/core';
import Deck from './Deck';

export const Cribbage = {
  setup: (ctx) => ({
    deck: new Deck(),
    board: [],
    players: Array(ctx.numPlayers).fill({
      hand: [],
      score: 0
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
      next: 'cribbing'
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

      // Ends the phase if this returns true.
      // endIf: (G, ctx) => {
      //   // once both players have selected their cards for the crib
      //   return true;
      // },

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

      // endIf: (G, ctx) => {
      //   // all players hands are empty
      //   return true;
      // },

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

      // endIf: (G, ctx) => {
      //   // all players done scoring
      //   return true;
      // },

      onEnd: (G, ctx) => {
        // change dealer
        return G;
      },

      next: 'cribbing'
    },
  },
}