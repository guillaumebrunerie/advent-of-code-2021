const fs = require("fs");

// 30 min
// 21:20 -> 21:31 -> 21:50

const allLetters = ["a", "b", "c", "d", "e", "f", "g"];

const PATTERNS = [
	"abcefg",
	"cf",
	"acdeg",
	"acdfg",
	"bcdf",
	"abdfg",
	"abdefg",
	"acf",
	"abcdefg",
	"abcdfg",
];

fs.readFile("./8.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const inputs = data.replace(/ \| /g, "|").split("\n").slice(0, -1).map(s => (
		s.split("|").map(s => s.split(" "))
	));

	const outputs = [].concat(...inputs.map(i => i[1]));

	console.log(outputs.filter(o => [2, 3, 4, 7].includes(o.length)).length);

	const decodeInput = input => {
		const [pattern, [n1, n2, n3, n4]] = input;
		const one = pattern.find(p => p.length == 2).split("");
		const seven = pattern.find(p => p.length == 3).split("");
		const four = pattern.find(p => p.length == 4).split("");
		const six = pattern.find(p => p.length == 6 && !one.every(letter => p.includes(letter))).split("");
		const nine = pattern.find(p => p.length == 6 && four.every(letter => p.includes(letter))).split("");
		const zero = pattern.find(p => p.length == 6 && one.every(letter => p.includes(letter)) && !four.every(letter => p.includes(letter))).split("");

		const a = seven.find(letter => !one.includes(letter));
		const c = allLetters.find(letter => !six.includes(letter));
		const d = allLetters.find(letter => !zero.includes(letter));
		const e = allLetters.find(letter => !nine.includes(letter));
		const f = one.find(letter => letter !== c);
		const b = four.find(letter => ![c, d, f].includes(letter));
		const g = allLetters.find(letter => ![a, b, c, d, e, f].includes(letter));

		const table = {
			[a]: "a",
			[b]: "b",
			[c]: "c",
			[d]: "d",
			[e]: "e",
			[f]: "f",
			[g]: "g",
		};

		const decodeDigit = pattern => PATTERNS.findIndex(x => (
			x === pattern.split("").map(x => table[x]).sort().join("")
		));

		return (1000 * decodeDigit(n1) + 100 * decodeDigit(n2) + 10 * decodeDigit(n3) + decodeDigit(n4));
	};

	console.log(inputs.map(i => decodeInput(i)).reduce((acc, x) => acc + x, 0));
});
