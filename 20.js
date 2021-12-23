const fs = require("fs");

// 21 min
// 19:58 -> 20:17 -> 20:19

fs.readFile("./20.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const [algorithmData, imageData] = data.split("\n\n");
	const algorithm = algorithmData.split("").map(x => x == "#" ? "1" : "0");
	const image = imageData.split("\n").slice(0, -1).map(line => line.split("").map(x => x == "#" ? "1" : "0"));

	const extendImage = ({image, outside}) => {
		const width = image[0].length + 2;
		const emptyLine = new Array(width).fill(outside);
		return {
			image: [
				emptyLine,
				...image.map(line => [outside, ...line, outside]),
				emptyLine,
			],
			outside
		};
	};

	// The image should be already extended
	const enhanceImage = (img) => {
		const {image, outside} = extendImage(img);
		const newOutside = outside == "0" ? algorithm[0] : algorithm[511];
		const newImage = image.map((line , i) => line.map((v, j) => {
			if (i == 0 || j == 0 || i == image.length - 1 || j == line.length - 1)
				return newOutside;

			const value = parseInt(
				image[i-1][j-1] + image[i-1][j] + image[i-1][j+1]
					+ image[i][j-1] + image[i][j] + image[i][j+1]
					+ image[i+1][j-1] + image[i+1][j] + image[i+1][j+1],
				2
			);
			return algorithm[value];
		}));
		return {image: newImage, outside: newOutside};
	};

	const initialImage = extendImage({image, outside: "0"});

	const doIt = (initialImage, n) => {
		const enhanceNTimes = (img, n) => (
			n == 0 ? img : enhanceNTimes(enhanceImage(img), n - 1)
		);
		const result = enhanceNTimes(initialImage, n);

		return result.image.reduce((acc, line) => acc + line.reduce((acc2, v) => acc2 + (v == "1" ? 1 : 0), 0), 0);
	};

	console.log(doIt(initialImage, 2));
	console.log(doIt(initialImage, 50));
});
