const fs = require("fs");

// 32 min
// 19:23 -> 19:32 -> 19:55

fs.readFile("./9.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const heightMap = data.split("\n").slice(0, -1).map(line => line.split("").map(s => Number(s)));

	const markedLowPoints = heightMap.map((line, row) => line.map((height, col) => {
		const smaller = (r, c, v) => heightMap[r] == undefined || heightMap[r][c] == undefined || v < heightMap[r][c];
		if (smaller(row - 1, col, height) && smaller(row + 1, col, height) && smaller(row, col - 1, height) && smaller(row, col + 1, height)) {
			return (height + 1);
		} else {
			return 0;
		}
	}));

	const result = markedLowPoints.reduce((acc, line) => acc + line.reduce((acc, height) => acc + height, 0), 0);

	console.log(result);

	const lowPoints = markedLowPoints.map(line => line.map(point => point > 0 ? 1 : 0));

	const tryExtendBasinWith = (row, col, basin) => {
		const id = `${row}/${col}`;
		if (basin.includes(id))
			return basin;
		if (!heightMap[row] || heightMap[row][col] == undefined)
			return basin;
		if (heightMap[row][col] == 9)
			return basin;

		const willFlowDownTo = (r, c) => (
			heightMap[r]
			&& (heightMap[r][c] !== undefined)
			&& basin.includes(`${r}/${c}`)
			&& heightMap[r][c] < heightMap[row][col]
		);

		if (willFlowDownTo(row - 1, col)
			|| willFlowDownTo(row + 1, col)
			|| willFlowDownTo(row, col - 1)
			|| willFlowDownTo(row, col + 1))
			return tryExtendBasinAround([...basin, id], row, col);
		else
			return basin;
	};

	const tryExtendBasinAround = (basin, row, col) => {
		return (
			tryExtendBasinWith(
				row - 1, col,
				tryExtendBasinWith(
					row + 1, col,
					tryExtendBasinWith(
						row, col - 1,
						tryExtendBasinWith(
							row, col + 1,
							basin
					)
				)
			)
		)
	);
	};

	const basinsSizes = lowPoints.map((line, row) => line.map((point, col) => (
		point == 1 ? tryExtendBasinAround([`${row}/${col}`], row, col).length : 0
	)));

	const biggestSizes = [].concat(...basinsSizes).filter(x => x > 0).sort((a, b) => b - a);
	console.log(biggestSizes[0] * biggestSizes[1] * biggestSizes[2]);
});
