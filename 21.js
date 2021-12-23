const fs = require("fs");

// 57 min
// 19:58 -> 20:09 -> 20:55

fs.readFile("./21test.txt", "utf8", (err, data) => {
	// if (err)
	// 	throw new Error(err);

	// const startingPos = [4, 8];
	const startingPos = [9, 4];

	const initialState = {
		positions: startingPos,
		scores: [0, 0],
		toPlay: 0,
		dice: 1,
		numRolls: 0,
	};

	const roll = dice => ([dice, (dice % 100) + 1]);

	const play = (state) => {
		const {positions, scores, toPlay, dice, numRolls} = state;
		const [v1, d1] = roll(dice);
		const [v2, d2] = roll(d1);
		const [v3, d3] = roll(d2);
		const newDice = d3;
		const newNumRolls = numRolls + 3;
		const newToPlay = 1 - toPlay;
		const newPosition = (positions[toPlay] + v1 + v2 + v3 - 1) % 10 + 1;
		const newPositions = [...positions];
		newPositions[toPlay] = newPosition;
		const newScore = scores[toPlay] + newPosition;
		const newScores = [...scores];
		newScores[toPlay] = newScore;
		if (newScore >= 1000)
			return scores[newToPlay] * newNumRolls;
		else
			return play({
				positions: newPositions,
				scores: newScores,
				toPlay: newToPlay,
				dice: newDice,
				numRolls: newNumRolls,
			});
	};

	console.log(play(initialState));

	// Part 2

	// For each position/score/toPlay, I compute in how many universes it happens

	/*
	  3: 1
	  4: 3
	  5: 6
	  6: 7
	  7: 6
	  8: 3
	  9: 1
	*/

	const initialState2 = {
		positions: startingPos,
		scores: [0, 0],
		toPlay: 0,
	};

	const hashTable = {
		[JSON.stringify(initialState2)]: 1
	};

	const populateHashTable = (p1Score, p2Score, pos1, pos2, toPlay) => {
		// We want to determine in how many universes this state happens
		const state = {
			positions: [pos1, pos2],
			scores: [p1Score, p2Score],
			toPlay
		};
		const key = JSON.stringify(state);

		const hasPlayed = 1 - toPlay;
		let result = 0;
		if (state.scores[hasPlayed] >= state.positions[hasPlayed]) {
			const diceOutcomes = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]];
			const prevScores = [...state.scores];
			prevScores[hasPlayed] -= state.positions[hasPlayed];
			diceOutcomes.forEach(([d, bifurcations]) => {
				const prevPositions = [...state.positions];
				prevPositions[hasPlayed] = ((state.positions[hasPlayed] - d - 1) % 10 + 10) % 10 + 1;
				const prevState = {
					positions: [prevPositions[0], prevPositions[1]],
					scores: [prevScores[0], prevScores[1]],
					toPlay: hasPlayed,
				};
				const universes = hashTable[JSON.stringify(prevState)];
				if (universes)
					result += universes * bifurcations;
			});
			hashTable[key] = result;
		}
	};

	for (let totalScore = 0; totalScore <= 62; totalScore++) {
		for (let p1Score = 0; p1Score <= totalScore; p1Score++) {
			p2Score = totalScore - p1Score;
			for (let pos1 = 1; pos1 <= 10; pos1++) {
				for (let pos2 = 1; pos2 <= 10; pos2++) {
					for (let toPlay = 0; toPlay <= 1; toPlay++) {
						populateHashTable(p1Score, p2Score, pos1, pos2, toPlay);
					}
				}
			}
		}
	};

	// console.log(hashTable[JSON.stringify({
	// 	positions: [9, 8],
	// 	scores: [20, 10],
	// 	toPlay: 1,
	// })]);

	const totalUniverses = [0, 0];

	Object.keys(hashTable).forEach(key => {
		const universes = hashTable[key];
		const state = JSON.parse(key);

		// Player 1 just won
		if (state.scores[0] >= 21 && state.scores[0] - state.positions[0] < 21 && state.scores[1] < 21 && state.toPlay == 1)
			totalUniverses[0] += universes;

		// Player 2 just won
		if (state.scores[1] >= 21 && state.scores[1] - state.positions[1] < 21 && state.scores[0] < 21 && state.toPlay == 0)
			totalUniverses[1] += universes;
	});
	console.log(Math.max(...totalUniverses));
});
