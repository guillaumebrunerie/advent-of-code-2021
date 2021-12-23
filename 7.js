const fs = require("fs");

// 12 min
// 19:35 -> 19:40 -> 19:47

fs.readFile("./7.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const positions = data.split(",").map(s => Number(s));
	const sortedPositions = positions.sort((a, b) => a - b);
	const median = sortedPositions[Math.floor(positions.length / 2)];
	const fuel = sortedPositions.reduce((acc, pos) => acc + Math.abs(pos - median), 0);
	console.log(fuel);

	const fuelCostTo = mid => (
		sortedPositions.reduce((acc, pos) => acc + Math.abs(pos - mid) * (1 + Math.abs(pos - mid)) / 2, 0)
	);

	const fuelCosts = [...Array(sortedPositions[sortedPositions.length - 1]).keys()].map(mid => fuelCostTo(mid));
	console.log(Math.min(...fuelCosts));
});
