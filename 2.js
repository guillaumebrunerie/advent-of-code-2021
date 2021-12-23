const fs = require("fs");

fs.readFile("./2.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const directions = data.split("\n").map(str => str.split(" ")).slice(0, -1);
	const reducingFunction = ({x, y}, [dir, v]) => (
		dir == "forward" ? {x: x + Number(v), y} :
		dir == "down" ? {x, y: y + Number(v)} : {x, y: y - Number(v)}
	);
	const result = directions.reduce(reducingFunction, {x: 0, y: 0});
	console.log(result.x * result.y);

	const reducingFunction2 = ({x, y, aim}, [dir, v]) => (
		dir == "forward" ? {x: x + Number(v), y: y + aim * Number(v), aim} :
		{x, y, aim: aim + (dir == "down" ? Number(v) : -Number(v))}
	);
	const result2 = directions.reduce(reducingFunction2, {x: 0, y: 0, aim: 0});
	console.log(result2.x * result2.y);
});
