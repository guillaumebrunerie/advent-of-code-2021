const fs = require("fs");

// 20 min
// 10:57 -> 11:10 -> 11:17

fs.readFile("./10.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const lines = data.split("\n").slice(0, -1);

	const parse = (str, pos = 0, chunks = []) => {
		if (pos == str.length)
			return {corrupted: 0, incomplete: completeValue(chunks)};

		const char = str[pos];

		const openingChar = {
			")": "(",
			"]": "[",
			"}": "{",
			">": "<",
		};

		const value = {
			")": 3,
			"]": 57,
			"}": 1197,
			">": 25137,
		};

		if (["(", "[", "{", "<"].includes(char)) {
			return parse(str, pos + 1, [char, ...chunks]);
		} else {
			if (chunks.length == 0 || chunks[0] !== openingChar[char])
				return {corrupted: value[char], incomplete: 0}; //parse error
			else
				return parse(str, pos + 1, chunks.slice(1));
		}
	};

	const completeValue = (chunks, acc = 0) => {
		if (chunks.length == 0)
			return acc;

		const [char, ...newChunks] = chunks;

		const value = {
			"(": 1,
			"[": 2,
			"{": 3,
			"<": 4,
		};
		return completeValue(newChunks, acc * 5 + value[char]);
	};

	console.log(lines.map(line => parse(line)).reduce((acc, {corrupted}) => acc + corrupted, 0));

	const incompleteScores = lines.map(line => parse(line).incomplete).sort((a, b) => a - b).filter(n => n > 0);
	console.log(incompleteScores[(incompleteScores.length - 1) / 2]);
});
