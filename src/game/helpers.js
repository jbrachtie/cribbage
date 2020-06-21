export const assignDealer = (players) => {
  let hands = players.reduce((acc, cur) => {
    acc.push(cur.hand[0].value);
    return acc;
  }, []);
  let dealerId = hands.indexOf(Math.min(...hands));
  players[dealerId].dealer = true;
  return players;
}

export const resetHands = (players) => {
  return players.map(p => {
    p.hand = [];
    return p;
  });
}