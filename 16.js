const fs = require("fs");

// 44 min
// 12:12 -> 12:50 -> 12:56

fs.readFile("./16.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const inputs = data.split("\n").slice(0, -1);

	const parseToBinary = input => [].concat(...input.split("").map(n => (
		("0000" + parseInt(n, 16).toString(2)).slice(-4).split("")
	)));

	const parsePacket = input => {
		const [v1, v2, v3, t1, t2, t3, ...rest] = input;
		const version = parseInt(v1 + v2 + v3, 2);
		const type = parseInt(t1 + t2 + t3, 2);
		if (type == 4) {
			const {result: literal, rest: rest2} = parseLiteral(rest);
			return {version, type, literal, rest: rest2};
		} else {
			const {contents, rest: rest2} = parseOperators(rest);
			return {version, type, contents, rest: rest2};
		}
	};

	const parseLiteral = (input, acc = 0) => {
		const [a1, a2, a3, a4, a5, ...rest] = input;

		const result = acc * 16 + parseInt(a2 + a3 + a4 + a5, 2);
		if (a1 == "0")
			return {result, rest};
		else
			return parseLiteral(rest, result);
	};

	const parseOperators = (input) => {
		const [type, ...rest] = input;
		if (type == "0")
			return parseOperatorType0(rest);
		else
			return parseOperatorType1(rest);
	};

	const parseOperatorType0 = (input) => {
		const [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, ...rest] = input;
		const length = parseInt(l1 + l2 + l3 + l4 + l5 + l6 + l7 + l8 + l9 + l10 + l11 + l12 + l13 + l14 + l15, 2);
		return parseMultiplePackets(rest, 0, length);
	};

	const parseOperatorType1 = (input) => {
		const [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, ...rest] = input;
		const length = parseInt(l1 + l2 + l3 + l4 + l5 + l6 + l7 + l8 + l9 + l10 + l11, 2);
		return parseMultiplePackets(rest, 1, length);
	};

	const parseMultiplePackets = (input, type, length, acc = []) => {
		const packet = parsePacket(input);
		const {rest} = packet;
		const newLength = type == 0 ? (length - (input.length - rest.length)) : length - 1;
		const contents = [...acc, packet];
		if (newLength == 0)
			return {contents, rest};
		else
			return parseMultiplePackets(rest, type, newLength, contents);
	};

	const sumVersionNumbers = (packet) => {
		if (!packet.contents)
			return packet.version;
		else
			return packet.version + packet.contents.reduce((sum, p) => sum + sumVersionNumbers(p), 0);
	};

	// Part 1
	console.log(sumVersionNumbers(parsePacket(parseToBinary(inputs[0]))));

	const interpret = packet => {
		const contents = (packet.contents || []).map(interpret);
		switch (packet.type) {
		case 0:
			return contents.reduce((acc, x) => acc + x, 0);
		case 1:
			return contents.reduce((acc, x) => acc * x, 1);
		case 2:
			return Math.min(...contents);
		case 3:
			return Math.max(...contents);
		case 4:
			return packet.literal;
		case 5:
			return contents[0] > contents[1] ? 1 : 0;
		case 6:
			return contents[0] < contents[1] ? 1 : 0;
		case 7:
			return contents[0] == contents[1] ? 1 : 0;
		}
	};

	console.log(interpret(parsePacket(parseToBinary(inputs[0]))));
});
