const fs = require("fs");

// 12 min
// 11:06 -> 11:17 -> 11:18

fs.readFile("./25.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const map = data.split("\n").slice(0, -1).map(line => line.split(""));

	const moveEast = (map) => {
		const newMap = map.map(line => [...line]);
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[0].length; j++) {
				if (map[i][j] == ">" && map[i][(j + 1) % map[0].length] == ".") {
					newMap[i][j] = ".";
					newMap[i][(j + 1) % map[0].length] = ">";
				}
			}
		}
		return newMap;
	};

	const moveSouth = (map) => {
		const newMap = map.map(line => [...line]);
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[0].length; j++) {
				if (map[i][j] == "v" && map[(i + 1) % map.length][j] == ".") {
					newMap[i][j] = ".";
					newMap[(i + 1) % map.length][j] = "v";
				}
			}
		}
		return newMap;
	};

	const step = map => moveSouth(moveEast(map));

	const firstStep = (map, count = 0) => {
		const newMap = step(map);
		if (JSON.stringify(map) == JSON.stringify(newMap))
			return count + 1;
		else
			return firstStep(newMap, count + 1);
	};

	console.log(firstStep(map));
});
