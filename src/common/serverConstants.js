const CLASS_STATS = {
  'Knight': {
    'health': 100,
    'speed': 3,
    'attack': 400,
    'counterattack': 20,
    'range': 1
  },
  'Archer': {
    'health': 75,
    'speed': 3,
    'attack': 30,
    'counterattack': 20,
    'range': 2
  },
  'Rogue': {
    'health': 75,
    'speed': 4,
    'attack': 30,
    'counterattack': 30,
    'range': 1
  },
  'Tank': {
    'health': 150,
    'speed': 2,
    'attack': 40,
    'counterattack': 20,
    'range': 1
  },
};

const CLASS_CHOICES = Object.keys(CLASS_STATS)

const GRID = [
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
  ["L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L"],
];

const CHARACTER_POSITIONS = [[0, 0], [0, 10], [10, 0], [10, 10]];

const randomizeGrid = () => {
  let newGrid = JSON.parse(JSON.stringify(GRID));
  return newGrid;
}

module.exports = {CLASS_STATS, CLASS_CHOICES, CHARACTER_POSITIONS, randomizeGrid};
