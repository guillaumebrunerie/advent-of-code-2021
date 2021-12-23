const fs = require("fs");

fs.readFile("./1.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const numbers = data.split("\n").map(s => Number(s));
	const reducingFunction = (acc, num, i, array) => (
		acc + (num > array[i - 1] ? 1 : 0)
	);
	const result = numbers.reduce(reducingFunction, 0);
	console.log(result);

	const newNumbers = numbers.map((n, i) => (
		i > 0 && i < numbers.length - 2 && (numbers[i - 1] + n + numbers[i + 1])
	)).filter(n => n !== false);
	const result2 = newNumbers.reduce(reducingFunction, 0);
	console.log(result2);
});
