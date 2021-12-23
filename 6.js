const fs = require("fs");

// 17 min
// 19:47 -> 19:58 -> 20:04

fs.readFile("./6.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const fishs = data.split(",").map(s => Number(s));

	const growFish = fish => (fish == 0 ? [6, 8] : [fish - 1]);

	const oneDay = fishs => {
		const simpleFish = fishs.filter(fish => fish >= 1);
		const doubleFish = fishs.filter(fish => fish == 0);
		return [...simpleFish.map(f => f - 1), ...doubleFish.map(f => 6), ...doubleFish.map(f => 8)];
	};

	const nDays = (fishs, n) => n == 0 ? fishs : nDays(oneDay(fishs), n - 1);

	console.log(nDays(fishs, 80).length);

	const fishData = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(age => fishs.filter(f => f == age).length);
	const oneDayFishData = data => [...data.slice(1, 7), data[7] + data[0], data[8], data[0]];
	const nDaysFishData = (data, n) => n == 0 ? data : nDaysFishData(oneDayFishData(data), n - 1);
	const countData = data => data.reduce((acc, n) => acc + n, 0);
	console.log(countData(nDaysFishData(fishData, 256)));
});
