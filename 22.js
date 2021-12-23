const fs = require("fs");

// 1h 14min
// 00:31 -> 00:43 -> 1:45

fs.readFile("./22.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const cuboids = data.split("\n").slice(0, -1).map(line => {
		const [state, rest] = line.split(" ");
		const [a, b, c, d] = rest.split("..");
		const x = [Number(a.split("x=")[1]), Number(b.split(",")[0])];
		const y = [Number(b.split(",y=")[1]), Number(c.split(",")[0])];
		const z = [Number(c.split(",z=")[1]), Number(d)];
		return {on: state == "on", x, y, z};
	});

	const applyCuboid = (state, {on, x: [xmin, xmax], y: [ymin, ymax], z: [zmin, zmax]}) => {
		if (xmin < -50 || xmin > 50)
			return;
		for (let x = xmin; x <= xmax; x++) {
			for (let y = ymin; y <= ymax; y++) {
				for (let z = zmin; z <= zmax; z++) {
					state[x + " " + y + " " + z] = on;
				}
			}
		}
	};

	const state = {};
	cuboids.forEach(cuboid => applyCuboid(state, cuboid));
	console.log(Object.keys(state).filter(v => state[v]).length);

	const cutX = x => cuboid => {
		if (x > cuboid.x[0] && x <= cuboid.x[1])
			return [{...cuboid, x: [cuboid.x[0], x - 1]}, {...cuboid, x: [x, cuboid.x[1]]}];
		else
			return [cuboid];
	};

	const cutY = y => cuboid => {
		if (y > cuboid.y[0] && y <= cuboid.y[1])
			return [{...cuboid, y: [cuboid.y[0], y - 1]}, {...cuboid, y: [y, cuboid.y[1]]}];
		else
			return [cuboid];
	};

	const cutZ = z => cuboid => {
		if (z > cuboid.z[0] && z <= cuboid.z[1])
			return [{...cuboid, z: [cuboid.z[0], z - 1]}, {...cuboid, z: [z, cuboid.z[1]]}];
		else
			return [cuboid];
	};

	const doCuts = (f, cuboids) => [].concat(...cuboids.map(f));

	const disjoint = (cuboid1, cuboid2) => (
		cuboid1.x[0] > cuboid2.x[1] || cuboid1.x[1] < cuboid2.x[0] ||
		cuboid1.y[0] > cuboid2.y[1] || cuboid1.y[1] < cuboid2.y[0] ||
		cuboid1.z[0] > cuboid2.z[1] || cuboid1.z[1] < cuboid2.z[0]
	);

	const difference = (cuboid1, cuboid2) => {
		if (disjoint(cuboid1, cuboid2))
			return [cuboid1];
		const cuboids = (
			doCuts(
				cutX(cuboid2.x[0]),
				doCuts(
					cutX(cuboid2.x[1] + 1),
					doCuts(
						cutY(cuboid2.y[0]),
						doCuts(
							cutY(cuboid2.y[1] + 1),
							doCuts(
								cutZ(cuboid2.z[0]),
								doCuts(
									cutZ(cuboid2.z[1] + 1),
									[cuboid1]
								)
							)
						)
					)
				)
			)
		);
		return cuboids.filter(cuboid => !(
			cuboid.x[0] >= cuboid2.x[0] && cuboid.x[0] <= cuboid2.x[1]
				&& cuboid.y[0] >= cuboid2.y[0] && cuboid.y[0] <= cuboid2.y[1]
				&& cuboid.z[0] >= cuboid2.z[0] && cuboid.z[0] <= cuboid2.z[1]
		));
	};

	const applyCuboid2 = (state, {on, ...cuboid}) => {
		const newState = [];
		state.forEach(cub => {newState.push(...difference(cub, cuboid));});
		if (on)
			newState.push(cuboid);
		return newState;
	};

	const count = (state) => (
		state.reduce((acc, {x, y, z}) => acc + (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1), 0)
	);

	const result = cuboids.reduce((state, cuboid) => applyCuboid2(state, cuboid), []);
	console.log(count(result));
});
