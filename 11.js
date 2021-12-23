const fs = require("fs");

// 17 min
// 10:39 -> 10:54 -> 10:56

fs.readFile("./11.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const grid = data.split("\n").slice(0, -1).map(line => line.split("").map(s => Number(s)));

	const increaseAll = grid => grid.map(line => line.map(num => num + 1));
	const doOneFlash = grid => grid.map((line, row) => line.map((num, col) => {
		if (num == 0) return 0;
		if (num > 9) return 0;
		let additionalLight = 0;
		[-1, 0, 1].forEach(dR =>
			[-1, 0, 1].forEach(dC => {
				if (grid[row + dR] && grid[row + dR][col + dC] && grid[row + dR][col + dC] > 9)
					additionalLight++;
			})
		);
		return num + additionalLight;
	}));
	const doAllFlashes = grid => {
		if (grid.some(line => line.some(num => num > 9)))
			return doAllFlashes(doOneFlash(grid));
		else
			return grid;
	};
	const step = grid => doAllFlashes(increaseAll(grid));

	const countAndSteps = (grid, count, acc = 0) => {
		if (count == -1)
			return acc;
		const flashes = [].concat(...grid).filter(n => n == 0).length;
		return countAndSteps(step(grid), count - 1, acc + flashes);
	};

	console.log(countAndSteps(grid, 100));

	const firstSynchronizedStep = (grid, count = 0) => {
		if (grid.every(line => line.every(num => num == 0)))
			return count;
		else
			return firstSynchronizedStep(step(grid), count + 1);
	};

	console.log(firstSynchronizedStep(grid));
});
