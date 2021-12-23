const fs = require("fs");

// 17 min
// 11:24 -> 11:36 -> 11:41

fs.readFile("./12.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const singleConnections = data.split("\n").slice(0, -1).map(path => path.split("-"));
	const connections = singleConnections.reduce((acc, [from, to]) => [...acc, [from, to], [to, from]], []);

	const isSmallCave = cave => "abcdefghijklmnopqrstuvwxyz".indexOf(cave[0]) >= 0;

	const computePaths = (connections, currentPath = ["start"]) => {
		const last = currentPath[currentPath.length - 1];
		if (last == "end")
			return [currentPath];

		const possibleEnds = connections.filter(([from, to]) => (
			from == last && (currentPath.indexOf(to) == -1 || !isSmallCave(to))
		)).map(([from, to]) => to);

		return [].concat(...possibleEnds.map(end => computePaths(connections, [...currentPath, end])));
	};

	console.log(computePaths(connections).length);

	const computePaths2 = (connections, currentPath = ["start"]) => {
		const last = currentPath[currentPath.length - 1];
		if (last == "end")
			return [currentPath];

		const possibleEnds = connections.filter(([from, to]) => (
			from == last && (
				currentPath.indexOf(to) == -1
					|| !isSmallCave(to)
					|| (
						to !== "start"
							&& to !== "end"
							&& currentPath.filter(p => p === to).length === 1
							&& currentPath.every(q => !isSmallCave(q) || currentPath.filter(p => p === q).length === 1)
					)
			)
		)).map(([from, to]) => to);

		return [].concat(...possibleEnds.map(end => computePaths2(connections, [...currentPath, end])));
	};

	console.log(computePaths2(connections).length);
});
