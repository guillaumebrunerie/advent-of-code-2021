const fs = require("fs");

// 39 min
// 20:16 -> 20:35 -> 20:45

fs.readFile("./17.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const [xbounds, ybounds] = data.slice("target area: x=".length).split(", y=");
	const [xMin, xMax] = xbounds.split("..").map(Number);
	const [yMin, yMax] = ybounds.split("..").map(Number);

	const testValidVx = (vx, x = 0) => {
		if (x >= xMin && x <= xMax)
			return true;
		else if (vx == 0)
			return false;
		else
			return testValidVx(Math.max(vx - 1, 0), x + vx);
	};

	const testValidV = (vx, vy, x = 0, y = 0) => {
		if (x >= xMin && x <= xMax && y >= yMin && y <= yMax)
			return true;
		else if (y < yMin || x > xMax)
			return false;
		else
			return testValidV(Math.max(vx - 1, 0), vy - 1, x + vx, y + vy);
	};

	const validVx = [...Array(xMax + 1).keys()].filter(vx => testValidVx(vx));

	const findBestVy = (vx, vy = -yMin) => {
		if (vy < yMin)
			return -Infinity;
		else if (testValidV(vx, vy))
			return Math.max(vy, 0);
		else
			return findBestVy(vx, vy - 1);
	};

	const bestVy = Math.max(...validVx.map(vx => findBestVy(vx)));
	console.log(bestVy * (bestVy + 1) / 2);

	const findAllVy = (vx, vy = -yMin, acc = []) => {
		if (vy < yMin)
			return acc;
		else
			return findAllVy(vx, vy - 1, testValidV(vx, vy) ? [...acc, [vx, vy]] : acc);
	};

	console.log([].concat(...validVx.map(vx => findAllVy(vx))).length);
});
