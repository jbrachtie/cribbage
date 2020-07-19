// import { INVALID_MOVE } from 'boardgame.io/core';
import Deck from './Deck';
import { 
  assignDealer,
  resetHands,
  deal,
  scorePlayPoints
} from './helpers';

export const Cribbage = {
  setup: (ctx) => ({
    deck: new Deck(), // { cards(Array), flipped(card) }
    board: [], // [ card objects - {suit, rank, value}]
    players: Array(ctx.numPlayers).fill({
      hand: [], // [ card objects ]
      played: [], // [ card objects ]
      score: 0
    }),
    dealer: 0,
    playTotal: 0,
    crib: [] // [ card objects ]
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
    // TODO: "current player" isn't really a thing here
    // maybe should be in stages where turn/order not important
    cribbing: {
      onBegin: (G, ctx) => {
        // shuffle deck, dealer deals 6 cards to each
        G.deck = G.deck.shuffle();
        G = deal(G, ctx.numPlayers);
      },
      // in between:
      // each player chooses cards for the crib (dealer's)
      // TODO: must complete moveToCrib before cut
      moves: {
        // playerId is my param
        // idxs is array of the indices of cards to crib
        // TODO: end turn after choosing cards for crib
        moveToCrib: (G, ctx, playerId, idxs) => {
          let cardsForCrib = []
          idxs.forEach(i => {
            cardsForCrib.push(G.players[playerId].hand[i]);
          });
          G.crib = [...G.crib, ...cardsForCrib];
          // G.crib.push(...cardsForCrib);
          G.players[playerId].hand = G.players[playerId].hand.filter(card => {
            return !cardsForCrib.includes(card);
          });
        },
        // non-dealer is choosing the cut position
        cut: (G, ctx, index) => {
          // TODO: make invalid for dealer
          let cut = G.deck.take(index);
          G.deck.cards.unshift(cut);
          G.deck.flipped = cut;
        }
      },
      endIf: (G, ctx) => {
        // once both players have selected their cards for the crib
        // or once flipped?
      },
      // TECHNICALLY don't need the deck after the cut...
      // maybe clear it for debugging space? (except flipped)
      onEnd: (G, ctx) => {
        // check "2 for his heels"
        if (G.deck.flipped.rank === "J") {
          G.players[G.dealer].score += 2;
        }
        // TODO: maybe remove when not debugging
        G.deck.cards = [];
      },
      next: 'pegging'
    },
    // non-dealer starts
    // TODO: cap at 31
    // TODO: add points for 31
    // TODO: add go (move + points)
    pegging: {
      onBegin: (G, ctx) => {
        // TODO: fix this it's gross looking
        // not working? won't let this player make a move on start
        // ctx.currentPlayer = Number(!G.dealer)
      },

      moves: {
        // idx = idx from current player's hand
        playCard: (G, ctx, idx) => {
          // move card from hand to played/board
          let [card] = G.players[ctx.currentPlayer].hand.splice(idx, 1);
          G.board.push(card);
          G.players[ctx.currentPlayer].played.push(card);
          // update play total
          G.playTotal += card.value;
          // check if play will score points
          let points = scorePlayPoints(G, ctx);
          // add those points to player's score
          G.players[ctx.currentPlayer].score += points;
          // log play (TODO: don't add 'for' if 0pts)
          console.log(`${G.playTotal} for ${points}`);
        }
      },
      // runs after each move i think?
      // end if all players hands are empty
      // TODO: can also check for go's?
      endIf: (G, ctx) => {
        return G.players.every((p) => !p.hand.length)
      },
      next: 'scoring',
    },
    scoring: {
      moves: {
        scoreHand: (G, ctx) => {

        },
        // only valid for dealer
        scoreCrib: (G, ctx) => {

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