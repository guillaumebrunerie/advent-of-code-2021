const fs = require("fs");

fs.readFile("./4.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const lines = data.split("\n\n");
	const numbers = lines[0].split(",").map(x => (
        Number
    ));
	const grids = lines.slice(1).map(grid => (
		grid.split("\n").filter(line => !!line).map(line => (
			line.split(" ").filter(x => !!x).map(Number)
		))
	));

	const applyNextNumber = ({numbers, grids}) => {
		const [num, ...nextNumbers] = numbers;
		const newGrids = grids.map(grid => (
			grid.map(line => (
				line.map(n => n == num ? n + 100 : n)
			))
		));
		return {numbers: nextNumbers, calledNumber: num, grids: newGrids};
	};

	const checkGrid = grid => {
		const indices = [0, 1, 2, 3, 4];
		const row = indices.find(row => indices.every(col => grid[row][col] >= 100));
		const col = indices.find(col => indices.every(row => grid[row][col] >= 100));
		if (row !== undefined || col !== undefined)
			return true;
		return false;
	};

	const computeGrid = grid => (
		grid.reduce((acc, line) => (
			acc + line.reduce((acc, num) => (
				num >= 100 ? acc : acc + num
			), 0)
		), 0)
	);

	const findFirstGrid = ({numbers, calledNumber, grids}) => {
		const grid = grids.find(grid => checkGrid(grid));
		if (grid !== undefined)
			return computeGrid(grid) * calledNumber;
		else
			return findFirstGrid(applyNextNumber({numbers, grids}));
	};

	console.log(findFirstGrid({numbers, grids}));

	const findLastGrid = ({numbers, calledNumber, grids}) => {
		const newResult = applyNextNumber({numbers, grids});
		if (grids.length == 1 && checkGrid(newResult.grids[0])) {
			return computeGrid(newResult.grids[0]) * newResult.calledNumber;
		} else {
			return findLastGrid({
				...newResult,
				grids: newResult.grids.filter(grid => !checkGrid(grid)),
			});
		}
	};

	console.log(findLastGrid({numbers, grids}));
});
