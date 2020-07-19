export const assignDealer = (G) => {
  let hands = G.players.reduce((acc, cur) => {
    acc.push(cur.hand[0].value);
    return acc;
  }, []);
  return hands.indexOf(Math.min(...hands));
  // players[dealerId].dealer = true;
  // return players;
}

export const resetHands = (players) => {
  return players.map(p => {
    p.hand = [];
    return p;
  });
}

// maybe this should be part of Deck idk
export const deal = (G, numPlayers) => {
  // dealer gets 1, 3, 5, 7, 9, 11
  // other gets 0, 2, 4, 6, 8, 10
  let handSize = 6;
  while(G.players[0].hand.length < handSize) {
    for(let i = 0; i < numPlayers; i++) {
      let cardToDeal = G.deck.take(0); // top card
      G.players[i].hand.push(cardToDeal);
    }
  }
  return G;
}

// move each gross thing to its own func
// probably nice to reuse for scoring phase
export const scorePlayPoints = (G, ctx) => {
  let scored = 0;

  // fifteen = 2
  if(G.playTotal === 15) {
    scored += 2;
    return scored;
  }

  // pair = 2
  // triplet = 6
  // four = 12
  let sliceSize = 2;
  let comboScores = [2, 6, 12];
  let combos = [0, 0, 0] // [pair, triplet, four] -> take max
  while(sliceSize <= 4 && G.board.length >= sliceSize) {
    let slice = G.board.slice(G.board.length - sliceSize)
    let isCombo = slice.every((card) => card.rank === slice[0].rank);
    let comboScore = isCombo ? comboScores[sliceSize - 2] : 0;
    combos[sliceSize - 2] = comboScore;
    sliceSize++;
  }
  let comboScore = Math.max(...combos);
  if(comboScore > 0) {
    scored += comboScore;
    return scored;
  }

  // run of x = x (x >= 3)
  let runs = [] // [run of 3, 4, 5, ...]
  for(let i = G.board.length - 3; i >= 0; i--) {
    let slice = G.board.slice(i);
    let max = 1;
    let min = 12;
    let seen = new Set();
    for(let j = 0; j < slice.length; j++) {
      let value = getOrderedValue(slice[j].rank);
      if(value > max) max = value;
      if(value < min) min = value;
      seen.add(value);
    }
    if(seen.length === slice.length && max - min + 1 === slice.length) {
      runs.push(slice.length); // points for a run of x
    } else {
      runs.push(0); // no points since dupes or math doesn't match
    }
  }
  let runScore = runs.length === 0 ? 0 : Math.max(...runs);
  if(runScore > 0) {
    scored =+ runScore;
    return scored;
  }

  return scored;
}

const getOrderedValue = (rank) => {
  if(rank === "A") return 1;
  if(rank === "J") return 10;
  if(rank === "Q") return 11;
  if(rank === "K") return 12;
  return Number(rank);
}