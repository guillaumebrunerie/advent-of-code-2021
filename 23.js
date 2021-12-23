const fs = require("fs");

// 2h 23min
// 21:31 -> 22:39 -> 23:54

fs.readFile("./23.txt", "utf8", (err, data) => {
	// if (err)
	// 	throw new Error(err);

	// const initialAntipods = [
	// 	// Already positioned
	// 	{destination: 1, place: "room", room: 4, position: 0, id: "a"},
	// 	{destination: 2, place: "room", room: 1, position: 1, id: "b1"},
	// 	{destination: 2, place: "room", room: 3, position: 1, id: "b2"},
	// 	// Already positioned
	// 	{destination: 3, place: "room", room: 2, position: 1, id: "c"},
	// 	{destination: 4, place: "room", room: 2, position: 0, id: "d1"},
	// 	{destination: 4, place: "room", room: 4, position: 1, id: "d2"},
	// ];

	const initialAntipods = [
		{destination: 1, place: "room", room: 2, position: 0, id: "a1"},
		{destination: 1, place: "room", room: 2, position: 1, id: "a2"},
		{destination: 2, place: "room", room: 3, position: 0, id: "b1"},
		{destination: 2, place: "room", room: 4, position: 0, id: "b2"},
		{destination: 3, place: "room", room: 1, position: 0, id: "c1"},
		{destination: 3, place: "room", room: 4, position: 1, id: "c2"},
		{destination: 4, place: "room", room: 1, position: 1, id: "d1"},
		{destination: 4, place: "room", room: 3, position: 1, id: "d2"},
	];

	let sizeOfRooms = 2;

	const possibleMoves = ({antipods, energy}) => {
		const result = [];
		antipods.forEach(antipod => {
			const others = antipods.filter(a => a !== antipod);
			// Where can an antipod move?
			if (antipod.place == "room") {
				if (!antipods.some(a => a.place == "room" && a.room == antipod.room && a.position > antipod.position)) {
					const min = Math.max(...antipods.map(a => a.place == "hallway" && a.position < antipod.room * 2 ? a.position + 1 : 0));
					const max = Math.min(...antipods.map(a => a.place == "hallway" && a.position > antipod.room * 2 ? a.position - 1 : 10));
					for (let position = min; position <= max; position++) {
						if ([2, 4, 6, 8].includes(position))
							continue;
						const blocks = (other) => {
							const aMin = Math.min(position, antipod.destination * 2);
							const aMax = Math.max(position, antipod.destination * 2);
							const oMin = Math.min(other.position, other.destination * 2);
							const oMax = Math.max(other.position, other.destination * 2);
							return (other.place == "hallway" && position >= oMin && position <= oMax && other.position >= aMin && other.position <= aMax);
						};
						if (others.some(other => blocks(other)))
							continue;

						const steps = (sizeOfRooms - antipod.position) + Math.abs(position - antipod.room * 2);
						const cost = steps * Math.pow(10, antipod.destination - 1);
						result.push({
							antipods: [...others, {destination: antipod.destination, place: "hallway", position, id: antipod.id}],
							energy: energy + cost,
						});
					}
				}
			} else {
				// The room is free
				if (!others.some(a => a.place == "room" && a.room == antipod.destination)) {
					const min = Math.min(antipod.position, antipod.destination * 2);
					const max = Math.max(antipod.position, antipod.destination * 2);
					// The passage is free
					if (!others.some(a => a.place == "hallway" && a.position >= min && a.position <= max)) {
						const steps = (
							(1 + others.filter(a => a.destination == antipod.destination).length)
								+ Math.abs(antipod.destination * 2 - antipod.position)
						);
						const cost = steps * Math.pow(10, antipod.destination - 1);
						// We remove it
						result.push({antipods: others, energy: energy + cost});
					}
				}
			}
		});
		return result;
	};

	const tryRandomStuff = (initial) => {
		let min = Infinity;
		while (true) {
			let state = {antipods: initial, energy: 0};
			const history = [state];
			while (state && state.antipods.length > 0) {
				let states = possibleMoves(state);
				if (states.some(s => s.antipods.length < state.antipods.length))
					states = states.filter(s => s.antipods.length < state.antipods.length);
				if (states.length > 0) {
					const i = Math.floor(Math.random() * states.length);
					state = states[i];
				} else {
					// console.log(state);
					state = null;
				}
				history.push(state);
			}
			if (state && state.energy < min) {
				min = state.energy;
				console.log("New minimum: " + min);
			}
		}
	};

	// Part 1:
	// tryRandomStuff(initialAntipods);

	// Part 2

	sizeOfRooms = 4;
	const newInitialAntipods = [
		...initialAntipods.map(antipod => antipod.position == 1 ? {...antipod, position: 3} : antipod),
		{destination: 1, place: "room", room: 3, position: 1, id: "a3"},
		{destination: 1, place: "room", room: 4, position: 2, id: "a4"},
		{destination: 2, place: "room", room: 2, position: 1, id: "b3"},
		{destination: 2, place: "room", room: 3, position: 2, id: "b4"},
		{destination: 3, place: "room", room: 2, position: 2, id: "c3"},
		{destination: 3, place: "room", room: 4, position: 1, id: "c4"},
		{destination: 4, place: "room", room: 1, position: 1, id: "d3"},
		{destination: 4, place: "room", room: 1, position: 2, id: "d4"},
	];

	// Does not work
	// tryRandomStuff(newInitialAntipods);

	const serialize = antipods => {
		const result = new Array(11 + sizeOfRooms * 4).fill("x");
		antipods.forEach(antipod => {
			const pos = antipod.place == "hallway" ? antipod.position : 11 + (antipod.room - 1) * sizeOfRooms + antipod.position;
			result[pos] = `${antipod.destination}`;
		});
		return result.join("");
	};

	const deserialize = str => {
		const result = [];
		str.split("").forEach((dest, i) => {
			if (dest == "x")
				return;

			const antipod = {};
			antipod.destination = Number(dest);
			if (i <= 10) {
				antipod.place = "hallway";
				antipod.position = i;
			} else {
				antipod.place = "room";
				antipod.room = Math.floor((i - 11) / sizeOfRooms) + 1;
				antipod.position = i - 11 - Math.floor((i - 11) / sizeOfRooms) * sizeOfRooms;
			}
			result.push(antipod);
		});
		return result;
	};

	// console.log(serialize(newInitialAntipods));
	// console.log(deserialize(serialize(newInitialAntipods)));

	const concatPossibleMoves = (universe, {str, energy}) => {
		const antipods = deserialize(str);
		const newStates = possibleMoves({antipods, energy}).map(({antipods, energy}) => ({str: serialize(antipods), energy}));
		newStates.forEach(st => {
			const existing = universe.find(({str, energy}) => str == st.str);
			if (!existing) {
				universe.push(st);
			} else if (existing.energy > energy) {
				existing.energy = st.energy;
			}
		});
	};

	let universe = [{str: serialize(newInitialAntipods), energy: 0}];
	let min = Infinity;
	const EMPTY = (new Array(11 + sizeOfRooms * 4).fill("x")).join("");
	while (universe.length > 0) {
		const newUniverse = [];
		universe.forEach(state => {
			concatPossibleMoves(newUniverse, state);
		});
		universe = newUniverse;
		// console.log(universe.length);
		universe.forEach(({str, energy}) => {
			if (str === EMPTY && energy < min) {
				// console.log("New minimum: " + energy);
				min = energy;
			}
		});
	}
	console.log(min);
});
