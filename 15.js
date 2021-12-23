const fs = require("fs");

// 44 min
// 00:10 -> 00:28 -> 00:54

fs.readFile("./15.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const risks = data.split("\n").slice(0, -1).map(line => line.split("").map(x => Number(x)));

	const improveData = risks => paths => {
		const maxI = paths.length;
		const maxJ = paths[0].length;
		const improvedAt = (i, j) => {
			const values = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([di, dj]) => (
				(paths[i + di] !== undefined && paths[i + di][j + dj] !== undefined)
					? paths[i + di][j + dj]
					: Infinity
				));
			const min = Math.min(...values);
			return Math.min(paths[i][j], min + risks[i][j]);
		};
		// return paths.map((line, i) => line.map((_, j) => improvedAt(i, j)));
		let actuallyImproved = false;
		paths.forEach((line, i) => line.forEach((_, j) => {
			if (paths[i][j] !== improvedAt(i, j))
				actuallyImproved = true;
			paths[i][j] = improvedAt(i, j);
		}));
		return [paths, actuallyImproved];
	};

	const initialPaths = risks => (
		risks.map((line, i) => line.map((_, j) => (i == 0 && j == 0) ? 0 : Infinity))
	);

	const applyUntilFinished = (f, a) => {
		const [result, improved] = f(a);
		// if (JSON.stringify(result) === oldA)
		// 	return result;
		if (!improved)
			return result[result.length - 1][result[0].length - 1];
		else
			return applyUntilFinished(f, result);
	};

	// Part 1:
	console.log(applyUntilFinished(improveData(risks), initialPaths(risks)));

	const size = risks.length;
	const fullRiskMap = [...Array(5 * size).keys()].map(i => (
		[...Array(5 * size).keys()].map(j =>
			(risks[i % size][j % size] + Math.floor(i / size) + Math.floor(j / size) - 1) % 9 + 1
		)
	));

	console.log(applyUntilFinished(improveData(fullRiskMap), initialPaths(fullRiskMap)));
});
