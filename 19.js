const fs = require("fs");

// 2h 57min
// 11:10 (paused at 11:51, resumed at 17:56) -> 19:48 -> 20:12

fs.readFile("./19.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const scanners = data.split("\n\n").map(scanner => (
		scanner.split("\n").slice(1).filter(s => !!s).map(beacon => (
			beacon.split(",").map(x => Number(x))
		))
	));

	const computeDiff = (b1, b2) => {
		const [x1, y1, z1] = b1;
		const [x2, y2, z2] = b2;
		return [x1 - x2, y1 - y2, z1 - z2].map(x => Math.abs(x)).sort((a, b) => a - b);
	};

	const computeDifferences = beacons => {
		const differences = [];
		beacons.forEach(b1 => {
			beacons.forEach(b2 => {
				if (b1 !== b2) {
					differences.push([computeDiff(b1, b2), b1, b2]);
				}
			});
		});
		return differences.map(([diffs, d1, d2]) => [JSON.stringify(diffs), d1, d2]).sort(([diffs1,,], [diffs2,,]) => diffs1.localeCompare(diffs2));
	};

	const differences = scanners.map(computeDifferences);
	const overlapping = [];

	// console.log(differences[0]);

	differences.forEach((bs1, i) => {
		differences.forEach((bs2, j) => {
			if (j <= i)
				return;
			const common = bs1.filter(a => bs2.some(b => a[0] == b[0] && a !== b));
			// console.log(common.length);
			if (common.length >= 132) {
				// const first = common[0];
				// const second = bs2.find(([d2,,]) => first[0] == d2);
				overlapping.push([i, j, common, common.map(x => bs2.find(a => x[0] == a[0] && a !== x))]);
			}
		});
	});

	// console.log(overlapping[0]);

	const orientations = [
		[[0, 1, 2], [1, 1, 1]],
		[[0, 2, 1], [1, 1, 1]],
		[[1, 2, 0], [1, 1, 1]],
		[[1, 0, 2], [1, 1, 1]],
		[[2, 0, 1], [1, 1, 1]],
		[[2, 1, 0], [1, 1, 1]],
		[[0, 1, 2], [-1, -1, 1]],
		[[0, 2, 1], [-1, -1, 1]],
		[[1, 2, 0], [-1, -1, 1]],
		[[1, 0, 2], [-1, -1, 1]],
		[[2, 0, 1], [-1, -1, 1]],
		[[2, 1, 0], [-1, -1, 1]],
		[[0, 1, 2], [1, -1, -1]],
		[[0, 2, 1], [1, -1, -1]],
		[[1, 2, 0], [1, -1, -1]],
		[[1, 0, 2], [1, -1, -1]],
		[[2, 0, 1], [1, -1, -1]],
		[[2, 1, 0], [1, -1, -1]],
		[[0, 1, 2], [-1, 1, -1]],
		[[0, 2, 1], [-1, 1, -1]],
		[[1, 2, 0], [-1, 1, -1]],
		[[1, 0, 2], [-1, 1, -1]],
		[[2, 0, 1], [-1, 1, -1]],
		[[2, 1, 0], [-1, 1, -1]],
		[[0, 2, 1], [-1, 1, 1]],
		[[0, 1, 2], [-1, 1, 1]],
		[[2, 1, 0], [-1, 1, 1]],
		[[2, 0, 1], [-1, 1, 1]],
		[[1, 0, 2], [-1, 1, 1]],
		[[1, 2, 0], [-1, 1, 1]],
		[[0, 2, 1], [1, -1, 1]],
		[[0, 1, 2], [1, -1, 1]],
		[[2, 1, 0], [1, -1, 1]],
		[[2, 0, 1], [1, -1, 1]],
		[[1, 0, 2], [1, -1, 1]],
		[[1, 2, 0], [1, -1, 1]],
		[[0, 2, 1], [1, 1, -1]],
		[[0, 1, 2], [1, 1, -1]],
		[[2, 1, 0], [1, 1, -1]],
		[[2, 0, 1], [1, 1, -1]],
		[[1, 0, 2], [1, 1, -1]],
		[[1, 2, 0], [1, 1, -1]],
		[[0, 2, 1], [-1, -1, -1]],
		[[0, 1, 2], [-1, -1, -1]],
		[[2, 1, 0], [-1, -1, -1]],
		[[2, 0, 1], [-1, -1, -1]],
		[[1, 0, 2], [-1, -1, -1]],
		[[1, 2, 0], [-1, -1, -1]],
	];

	const applyOrientation = ([[xt, yt, zt], [xs, ys, zs]], pos) => (
		[pos[xt] * xs, pos[yt] * ys, pos[zt] * zs]
	);

	const applyPosition = ([tx, ty, tz], pos) => (
		[pos[0] + tx, pos[1] + ty, pos[2] + tz]
	);

	// console.log(differences[0], differences[1]);
	const computeOrientationAndPosition = (b1, c1, b2, c2) => {
		const d1 = [b1[0] - c1[0], b1[1] - c1[1], b1[2] - c1[2]];
		const d2 = [b2[0] - c2[0], b2[1] - c2[1], b2[2] - c2[2]];
		const orientation = orientations.find(o => (
			JSON.stringify(d1) == JSON.stringify(applyOrientation(o, d2))
		));
		const a2 = applyOrientation(orientation, b2);
		const position = [b1[0] - a2[0], b1[1] - a2[1], b1[2] - a2[2]];
		// console.log(position);
		return {position, orientation};
	};

	const chooseOP = array => (
		array.find(x => array.filter(y => JSON.stringify(x) == JSON.stringify(y)).length > 10)
	);

	// console.log(differences[0][0][1], differences[0][0][2]);
	// console.log(differences[0]);
	// console.log(computeOrientation(differences[2][5]));

	// console.log(overlapping[0]);

	const allOAndP = overlapping.map(([i, j, xs, ys]) => {
		const pando = xs.map((x, k) => computeOrientationAndPosition(x[1], x[2], ys[k][1], ys[k][2]));
		return [i, j, chooseOP(pando)];
	});

	// console.log(allOAndP[0][2].map(x => JSON.stringify(x)).sort());

	const allPaths = {
		0: [],
	};

	let keepGoing = false;
	do {
		keepGoing = false;
		allOAndP.forEach(([i, j, pando]) => {
			if (allPaths[i] && !allPaths[j]) {
				allPaths[j] = [...allPaths[i], {pando, inverse: false}];
			} else if (allPaths[j] && !allPaths[i]) {
				allPaths[i] = [...allPaths[j], {pando, inverse: true}];
			} else if (!allPaths[i] && !allPaths[j]) {
				keepGoing = true;
			}
		});
	} while (keepGoing);

	const inverseO = ([dir, signs]) => {
		const a = dir.findIndex(x => x == 0);
		const b = dir.findIndex(x => x == 1);
		const c = dir.findIndex(x => x == 2);
		return [[a, b, c], [signs[a], signs[b], signs[c]]];
	};

	const applypando = ({pando, inverse}, pos) => {
		const {position, orientation} = pando;
		if (!inverse) {
			return applyPosition(position, applyOrientation(orientation, pos));
		} else {
			return applyOrientation(inverseO(orientation), applyPosition(position.map(x => -x), pos));
		}
	};

	const allBeacons = [];

	scanners.forEach((beacons, i) => {
		const beaconsOrdered = allPaths[i].reverse().reduce((allPos, pando) => allPos.map(pos => applypando(pando, pos)), beacons).map(x => JSON.stringify(x)).sort();
		beaconsOrdered.forEach(b => {
			if (!allBeacons.includes(b))
				allBeacons.push(b);
		});
		// console.log(i, beaconsOrdered);
	});

	console.log(allBeacons.length);

	// const i = 0;
	// const pando = computeOrientationAndPosition(overlapping[i][2][1], overlapping[i][2][2], overlapping[i][3][1], overlapping[i][3][2]);
	// console.log(scanners[overlapping[i][0]].sort());
	// console.log(scanners[overlapping[i][1]].map(x => applypando({pando, inverse: false}, x)).sort());

	// console.log(overlapping[0]);
	// const {position, orientation} = computeOrientationAndPosition(overlapping[i][2][1], overlapping[i][2][2], overlapping[i][3][1], overlapping[i][3][2]);
	// console.log(position, orientation);
	// console.log(applyOrientation(orientation, applyPosition(position, [-537, -823, -458])));

	// const findPath = i => {
	// 	if (i == 0)
	// 		return [];
	// 	allOAndP.filter(([i2,]) => i == i2).map(([i2,])
	// };


	// console.log(overlapping);

	// computeOrientation(differen

	// console.log(scanners.map(computeDifferences));


	const positions = scanners.map((a, i) => {
		const p = allPaths[i].reduce((pos, pando) => applypando(pando, pos), [0, 0, 0]);
		// const orientation = allPaths[i].length > 0 ? (!allPaths[i][0].inverse ? allPaths[i][0].pando.orientation : inverseO(allPaths[i][0].pando.orientation)) : [[0, 1, 2], [1, 1, 1]];
		return p;
	});

	// console.log(positions);

	let distance = 0;
	positions.forEach(p1 => {
		positions.forEach(p2 => {
			const dist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]) + Math.abs(p1[2] - p2[2]);
			// console.log(dist);
			distance = Math.max(distance, dist);
		});
	});

	console.log(distance);
});
