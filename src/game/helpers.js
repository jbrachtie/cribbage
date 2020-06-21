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