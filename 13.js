const fs = require("fs");

// 18 min
// 23:27 -> 23:40 -> 23:45

fs.readFile("./13.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const [pointsData, foldData] = data.split("\n\n");
	const points = pointsData.split("\n").map(s => s.split(",").map(s => Number(s)));
	const fold = foldData.split("\n").slice(0, -1).map(s => s.slice("fold along ".length).split("=")).map(([a, b]) => [a, Number(b)]);

	const doFold = (points, [foldAxis, foldValue]) => (
		points.reduce((acc, [x, y]) => {
			if (foldAxis === "x" && x > foldValue)
				x = 2 * foldValue - x;
			if (foldAxis === "y" && y > foldValue)
				y = 2 * foldValue - y;
			if (acc.some(([x2, y2]) => x == x2 && y == y2))
				return acc;
			else
				return [...acc, [x, y]];
		}, [])
	);

	console.log(doFold(points, fold[0]).length);

	const result = fold.reduce((points, fold) => doFold(points, fold), points);
	const tmp = [0, 1, 2, 3, 4, 5].map(y => [...Array(40).keys()].map(x => (
		result.some(([x2, y2]) => x2 == x && y2 == y) ? "█" : " "
	)));
	const finalResult = tmp.map(line => line.join("")).join("\n");

	console.log(finalResult);
});
