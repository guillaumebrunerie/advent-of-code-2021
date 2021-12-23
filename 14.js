const fs = require("fs");

// 38 min
// 00:02 -> 00:14 -> 00:40

fs.readFile("./14.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const [initial, rulesData] = data.split("\n\n");
	const rules = rulesData.slice(0, -1).split("\n").map(rule => rule.split(" -> "));

	const apply = (polymer, rules, acc = [polymer[0]], i = 0) => {
		if (i == polymer.length - 1)
			return acc;
		const rule = rules.find(r => r[0] == polymer[i] + polymer[i + 1]);
		if (!rule)
			return apply(polymer, rules, acc + polymer[i + 1], i + 1);
		else
			return apply(polymer, rules, acc + rule[1] + polymer[i + 1], i + 1);
	};

	const applyN = (n, initial, rules) => n == 0 ? initial : applyN(n - 1, apply(initial, rules), rules);

	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const result = applyN(10, initial, rules).split("");

	const getDifference = result => {
		const frequencies = letters.map(l => result.filter(x => x == l).length);
		const sortedFrequencies = frequencies.filter(f => f > 0).sort((a, b) => a - b);
		return sortedFrequencies[sortedFrequencies.length - 1] - sortedFrequencies[0];
	};
	console.log(getDifference(result));

	// Part 2

	const combine = (table1, table2, char) => {
		return Object.fromEntries(letters.map(l => (
			[l, table1[l] + table2[l] + (l == char ? 1 : 0)]
		)));
	};

	const hashTable = {};
	const empty = Object.fromEntries(letters.map(l => [l, 0]));

	// from has two characters, returns the total count after n steps without including them
	const getCounts = (n, from) => {
		if (n == 0)
			return empty;

		const existing = hashTable[n + from];
		if (existing !== undefined)
			return existing;

		const rule = rules.find(r => r[0] == from[0] + from[1]);
		if (!rule)
			throw new Error("No rule found");

		const middle = rule[1];
		const left = getCounts(n - 1, from[0] + middle);
		const right = getCounts(n - 1, middle + from[1]);
		const result = combine(left, right, middle);

		hashTable[n + from] = result;
		return result;
	};

	const getCountsWholeString = (n, polymer, i = 0, acc = combine(empty, empty, polymer[0])) => {
		if (i == polymer.length - 1)
			return acc;

		return getCountsWholeString(n, polymer, i + 1, combine(acc, getCounts(n, polymer[i] + polymer[i + 1]), polymer[i + 1]));
	};


	const getDifference2 = frequencies => {
		const sortedFrequencies = frequencies.filter(f => f > 0).sort((a, b) => a - b);
		return sortedFrequencies[sortedFrequencies.length - 1] - sortedFrequencies[0];
	};

	console.log(getDifference2(Object.values(getCountsWholeString(40, initial))));


}

);

Object.fromEntries = (iterable) => {
  return [...iterable].reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
  }, {});
};
