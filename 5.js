const fs = require("fs");

fs.readFile("./5.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const MAX = 1000;
	const array = [];
	for (let i = 0; i < MAX; i++) {
		array[i] = [];
		for (let j = 0; j < MAX; j++)
			array[i][j] = 0;
	}

	const lines = data.split("\n").slice(0, -1).map(line => (
		line.split(" -> ").map(coords => (
			coords.split(",").map(x => Number(x))
		))
	));

	lines.forEach(([[x1, y1], [x2, y2]]) => {
		if (x1 == x2) {
			for (let k = Math.min(y1, y2); k <= Math.max(y1, y2); k++) {
				array[x1][k]++;
			}
		}
		if (y1 == y2) {
			for (let k = Math.min(x1, x2); k <= Math.max(x1, x2); k++) {
				array[k][y1]++;
			}
		}
	});

	const getCount = () => {
		let count = 0;
		for (let i = 0; i < MAX; i++) {
			for (let j = 0; j < MAX; j++) {
				if (array[i][j] > 1)
					count++;
			}
		}
		return count;
	};

	console.log(getCount());

	lines.forEach(([[x1, y1], [x2, y2]]) => {
		if (x1 !== x2 && y1 !== y2) {
			const inverted = (x2 - x1) * (y2 - y1) < 0;
			for (let d = 0; d <= Math.abs(x1 - x2); d++) {
				const x = Math.min(x1, x2) + d;
				const y = inverted ? Math.max(y1, y2) - d : Math.min(y1, y2) + d;
				array[x][y]++;
			}
		}
	});

	console.log(getCount());
});
