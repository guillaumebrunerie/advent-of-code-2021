const fs = require("fs");

fs.readFile("./3.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const numbers = data.split("\n").map(s => s.split("")).slice(0, -1);
	const length = numbers.length;
	const findMostUsedBits = numbers => (
		numbers[0].map((_, i) => (
			numbers.filter(n => n[i] == "1").length >= numbers.length / 2 ? 1 : 0
		))
	);
	const mostUsedBits = findMostUsedBits(numbers);
	const leastUsedBits = mostUsedBits.map(x => 1 - x);
	const mostUsedNumber = parseInt(mostUsedBits.join(""), 2);
	const leastUsedNumber = parseInt(leastUsedBits.join(""), 2);
	console.log(mostUsedNumber * leastUsedNumber);

	const filterForOxygen = (numbers, i) => {
		const mostUsedBit = findMostUsedBits(numbers)[i];
		return numbers.filter(n => n[i] == mostUsedBit);
	};
	const filterForCO2 = (numbers, i) => {
		const mostUsedBit = findMostUsedBits(numbers)[i];
		return numbers.filter(n => n[i] != mostUsedBit);
	};
	const iterate = (numbers, f, i = 0) => (
		numbers.length == 1 ? numbers[0] : iterate(f(numbers, i), f, i + 1)
	);
	const oxygen = parseInt(iterate(numbers, filterForOxygen).join(""), 2);
	const co2 = parseInt(iterate(numbers, filterForCO2).join(""), 2);
	console.log(oxygen * co2);
});
