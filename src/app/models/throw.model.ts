export interface Throw {
  value: number; // 1-20 for numbers, 25 for bull
  multiplier: 1 | 2 | 3; // single, double, triple
  score: number; // calculated: value * multiplier
}

export interface Round {
  throws: Throw[];
  totalScore: number;
}
