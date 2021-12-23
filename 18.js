const fs = require("fs");

// 41 min
// 10:27 -> 11:05 -> 11:08

fs.readFile("./18.test.txt", "utf8", (err, data) => {
	// if (err)
		// throw new Error(err);

	const add = (n1, n2) => [n1, n2];

	const combineL = (n, k) => {
		if (Array.isArray(n)) {
			const [n1, n2] = n;
			return [combineL(n1, k), n2];
		} else {
			return n + k;
		}
	};

	const combineR = (n, k) => {
		if (Array.isArray(n)) {
			const [n1, n2] = n;
			return [n1, combineR(n2, k)];
		} else {
			return n + k;
		}
	};

	const tryExplode = (n, depth = 4) => {
		if (!Array.isArray(n))
			return {result: n, explode: false};
		else {
			const [n1, n2] = n;
			if (depth == 0) {
				return {result: 0, left: n1, right: n2, explode: true};
			}
			const {result: resultL, left: leftL, right: rightL, explode: explodeL} = tryExplode(n1, depth - 1);
			const {result: resultR, left: leftR, right: rightR, explode: explodeR} = tryExplode(n2, depth - 1);

			if (explodeL) {
				return {result: [resultL, combineL(n2, rightL)], left: leftL, right: 0, explode: true};
			}
			if (explodeR) {
				return {result: [combineR(n1, leftR), resultR], left: 0, right: rightR, explode: true};
			}
			return {result: n, explode: false};
		}
	};

	const explode = n => tryExplode(n).result;

	const split = n => {
		if (!Array.isArray(n)) {
			if (n >= 10)
				return [Math.floor(n / 2), Math.ceil(n / 2)];
			else
				return n;
		} else {
			const [n1, n2] = n;
			if (JSON.stringify(n1) !== JSON.stringify(split(n1)))
				return [split(n1), n2];
			else
				return [n1, split(n2)];
		}
	};
	// console.log(JSON.stringify(tryExplode([[[[[9,8],1],2],3],4]).result));
	// console.log(JSON.stringify(tryExplode([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]).result));

	const reduceExplode = n => {
		const str = JSON.stringify(n);
		// console.log(JSON.stringify(n));

		const n1 = explode(n);

		if (JSON.stringify(n1) !== str)
			return reduceExplode(n1);
		else
			return n;
	}

	const reduceSplit = n => {
		const str = JSON.stringify(n);
		// console.log(JSON.stringify(n));

		const n1 = split(n);

		if (JSON.stringify(n1) !== str)
			return reduceExplode(n1);
		else
			return n;
	}

	const reduce = n => {
		const str = JSON.stringify(n);
		const n1 = reduceExplode(n);
		const n2 = reduceSplit(n1);
		const str2 = JSON.stringify(n2);
		if (str == str2)
			return n2;
		else
			return reduce(n2);
	};

	const addMultiple = (ns) => (
		ns.reduce((acc, n) => reduce(add(acc, n)))
	);

	// const d = [
	// 	[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
	// 	[7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
	// 	[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
	// 	[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
	// 	[7,[5,[[3,8],[1,4]]]],
	// 	[[2,[2,2]],[8,[8,1]]],
	// 	[2,9],
	// 	[1,[[[9,3],9],[[9,0],[0,7]]]],
	// 	[[[5,[7,4]],7],1],
	// 	[[[[4,2],2],6],[8,7]],
	// ];

	// const d = [[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
	// 		   [[[5,[2,8]],4],[5,[[9,9],0]]],
	// 		   [6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
	// 		   [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
	// 		   [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
	// 		   [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
	// 		   [[[[5,4],[7,7]],8],[[8,3],8]],
	// 		   [[9,3],[[9,9],[6,[4,9]]]],
	// 		   [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
	// 		   [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
	// 		  ];

	const d = [[[[[3,0],[0,0]],1],4],
			   [[[[3,4],0],[7,7]],[1,6]],
			   [[[[2,0],5],7],[[[3,1],[2,6]],[[0,8],6]]],
			   [[[[5,5],0],1],[[[0,0],1],[[0,6],[0,9]]]],
			   [[0,[0,[1,7]]],[3,[1,[7,6]]]],
			   [[[9,[5,2]],[[5,2],[6,8]]],[[[7,0],7],[[2,3],[9,4]]]],
			   [[[[3,8],7],[[0,7],[2,0]]],[0,[[2,9],0]]],
			   [[[7,[2,2]],[3,4]],[6,7]],
			   [8,[[[3,3],8],[[7,1],[6,7]]]],
			   [[9,[9,8]],[[1,[9,1]],[2,5]]],
			   [[[7,8],[[1,2],[2,6]]],[[9,7],[6,[7,0]]]],
			   [[[3,3],[[5,6],5]],[[[2,8],1],9]],
			   [[[2,[5,0]],[[9,9],[4,0]]],[0,5]],
			   [[[9,3],[[9,4],[5,8]]],[[[3,2],[7,1]],[[3,8],1]]],
			   [[3,2],[[6,[0,9]],[8,3]]],
			   [[[5,7],[[7,4],[4,6]]],[[[9,8],3],3]],
			   [[[4,[2,8]],9],[[[8,5],[9,7]],[[8,9],[2,6]]]],
			   [[[1,[2,4]],6],[[8,[5,2]],[[0,7],[4,1]]]],
			   [[[[4,3],6],[[6,4],[4,2]]],[[9,0],[[5,9],9]]],
			   [[[[3,0],6],[4,[7,5]]],4],
			   [[[[1,0],[7,1]],0],[[[8,5],8],2]],
			   [[[[2,9],[4,1]],[[8,9],[3,3]]],[9,[[0,7],2]]],
			   [[1,[4,[4,2]]],[[[3,5],[8,8]],2]],
			   [[[8,[1,4]],[[6,5],5]],[[7,[4,7]],4]],
			   [[[[0,5],2],[[9,2],0]],0],
			   [[[[6,2],[2,4]],[0,[7,3]]],[9,[8,[5,9]]]],
			   [[8,0],2],
			   [[[[0,2],2],[[9,2],[8,1]]],[[[7,6],[5,3]],6]],
			   [[[[8,7],[5,3]],[[3,0],8]],[[[8,4],[2,2]],[[8,1],2]]],
			   [[[[1,5],[4,6]],[[4,0],[2,4]]],[[1,1],[[0,7],[7,3]]]],
			   [[7,2],[[7,[6,7]],[8,5]]],
			   [[[9,7],[[6,6],9]],8],
			   [[4,2],[[[1,0],[9,1]],[[0,7],[8,0]]]],
			   [[[[5,9],5],[8,9]],[[2,4],[[5,2],[8,3]]]],
			   [[[[4,5],[7,0]],[4,5]],[[7,[6,4]],[[1,7],[6,3]]]],
			   [[2,0],4],
			   [[2,[[5,1],[2,1]]],[[5,[7,2]],[[2,3],[7,0]]]],
			   [[4,[4,9]],[9,[6,8]]],
			   [[[[6,1],[1,5]],[0,[4,0]]],[[[7,0],2],4]],
			   [[[[3,3],[2,2]],[[2,4],2]],[[8,[1,1]],4]],
			   [[[[1,5],8],[[9,4],[7,7]]],[[[8,7],[7,2]],[0,[7,3]]]],
			   [9,[[7,[0,4]],4]],
			   [4,[0,8]],
			   [[[[2,6],1],[8,[8,4]]],[[8,2],[1,[8,4]]]],
			   [[7,[8,[8,8]]],[4,1]],
			   [[0,6],[[7,[5,9]],[[7,1],8]]],
			   [4,6],
			   [[[[3,2],[5,6]],[0,7]],[8,[7,[9,5]]]],
			   [[[3,7],[4,5]],6],
			   [[[0,[3,9]],[9,1]],6],
			   [[[[7,3],8],[6,7]],[[1,0],[1,7]]],
			   [[[5,[4,8]],2],[[[7,1],6],[[0,3],2]]],
			   [[1,0],[[1,2],[[2,0],1]]],
			   [[8,[[6,1],[7,1]]],0],
			   [[9,[2,0]],[[7,[6,2]],4]],
			   [[[9,[9,4]],[[4,8],3]],[[9,0],[[2,2],[0,6]]]],
			   [[[7,5],[[2,9],6]],[[2,4],[[1,1],[8,2]]]],
			   [[[1,[6,3]],[[2,2],[1,8]]],[[[7,3],[6,0]],[4,[7,6]]]],
			   [6,5],
			   [[3,[9,[4,4]]],[[6,9],[4,5]]],
			   [[[4,[1,8]],[[4,0],6]],[[[9,0],[8,3]],[[8,6],[3,2]]]],
			   [[[8,[1,2]],[[3,9],6]],[[3,0],1]],
			   [[1,[2,[4,0]]],6],
			   [0,[[[1,3],[9,1]],[[3,8],[9,4]]]],
			   [2,[2,[[2,7],[7,8]]]],
			   [[[3,0],[[4,6],2]],[9,2]],
			   [[[5,[2,2]],[[2,7],[9,9]]],[[3,[4,4]],[8,[9,8]]]],
			   [[[[7,5],[7,9]],[[8,5],6]],[[1,[8,4]],[8,2]]],
			   [[[6,4],[5,5]],[[[8,1],5],[[6,4],[6,9]]]],
			   [[[[8,9],0],[[4,6],7]],[[[3,9],[6,4]],[8,[7,4]]]],
			   [4,[[7,7],4]],
			   [[[[4,9],[1,2]],[8,[4,7]]],[[8,[4,8]],[0,[5,4]]]],
			   [1,[7,9]],
			   [[[5,[2,0]],[[4,3],[6,8]]],[9,9]],
			   [[[[3,9],9],[4,3]],[1,[3,[8,1]]]],
			   [[[[8,7],[6,1]],[3,9]],[5,[[8,0],4]]],
			   [[[[8,2],[4,6]],[6,[9,9]]],[1,[[7,7],4]]],
			   [[7,5],[[5,0],[0,3]]],
			   [[[6,0],[9,1]],[[[4,3],[5,0]],[[9,5],[0,0]]]],
			   [8,[[3,6],3]],
			   [[[[9,3],7],[1,3]],[[[6,4],[8,4]],[1,5]]],
			   [[[[3,8],2],[5,4]],[[[1,8],5],[2,[2,7]]]],
			   [[2,9],[6,[0,2]]],
			   [[2,[7,9]],[[4,1],[[9,2],[0,7]]]],
			   [[0,[6,4]],[[9,2],[0,[0,7]]]],
			   [[[[7,2],[8,6]],[6,2]],[[[1,6],[2,2]],1]],
			   [[1,6],[[[4,3],[8,2]],[3,[9,4]]]],
			   [[9,[7,3]],[[[7,0],4],[[1,7],[2,2]]]],
			   [[7,[5,[9,8]]],[[[7,5],[7,6]],[7,[9,8]]]],
			   [[[[6,1],[4,3]],4],[[[5,9],4],2]],
			   [[[[5,1],[2,5]],0],[[7,[5,7]],[[4,4],9]]],
			   [9,2],
			   [4,[[[6,6],5],7]],
			   [[8,[[7,3],[0,7]]],8],
			   [[[3,4],[[2,3],0]],[[[9,6],[1,1]],[4,[0,4]]]],
			   [[[[3,3],[2,3]],[2,5]],[[4,[2,7]],3]],
			   [[[8,[0,3]],2],[4,4]],
			   [[[3,5],[[2,1],[3,4]]],[[0,3],4]],
			   [[[[4,1],4],2],[[[3,7],2],[[8,1],3]]],
			   [[[[0,6],[7,3]],[5,[3,9]]],[7,[[4,1],8]]]
			  ];

	const magnitude = n => {
		if (Array.isArray(n))
			return (3 * magnitude(n[0]) + 2 * magnitude(n[1]));
		else
			return n;
	};

	console.log(magnitude(reduce(addMultiple(d))));

	let largestMagnitude = 0;
	d.forEach(n1 => d.forEach(n2 => {
		if (n1 == n2)
			return;
		const m = magnitude(reduce(add(n1, n2)));
		largestMagnitude = Math.max(m, largestMagnitude);
	}));

	console.log(largestMagnitude);
});