const fs = require("fs");

// 2h 56min
// 10:40 -> 13:32 -> 13:34

fs.readFile("./24.txt", "utf8", (err, data) => {
	if (err)
		throw new Error(err);

	const instructions = data.split("\n").slice(0, -1).map(line => line.split(" "));

	const memory = {x: 0, y: 0, z: 0, w: 0};
	let currentDigit = 0;

	const applyInstruction = (([type, a1, a2]) => {
		const v1 = (memory[a1] !== undefined) ? memory[a1] : Number(a1);
		const v2 = (memory[a2] !== undefined) ? memory[a2] : Number(a2);
		switch (type) {
			case "inp":
				memory[a1] = "i" + currentDigit;
				currentDigit++;
				break;
			case "add": {
				memory[a1] = add(v1, v2);
				break;
			}
			case "mul": {
				if (v1 == 0 || v2 == 0) {
					memory[a1] = 0;
					break;
				}
				if (v1 == 1) {
					memory[a1] = v2;
					break;
				}
				if (v2 == 1) {
					break;
				}
				memory[a1] = {type: "mul", v1, v2};
				break;
			}
			case "div": {
				memory[a1] = div(v1, v2);
				break;
			}
			case "mod": {
				memory[a1] = mod(v1, v2);
				break;
			}
			case "eql": {
				memory[a1] = eql(v1, v2);
				break;
			}
		}
	});

	const add = (v1, v2) => {
		if (v1 == 0)
			return v2;

		if (v2 == 0)
			return v1;

		if (!isNaN(v1) && !isNaN(v2))
			return v1 + v2;

		if (!isNaN(v2) && v1.type == "add" && !isNaN(v1.v2))
			return add(v1.v1, v2 + v1.v2);

		return {type: "add", v1, v2};
	};

	const div = (v1, v2) => {
		if (v1 == 0)
			return 0;

		if (v2 == 1)
			return v1;

		if (v1.type == "add" && !isNaN(v2)
			&& v1.v1.type == "mul" && v1.v1.v2 == v2 && min(v1.v2) !== null && min(v1.v2) >= 0 && max(v1.v2) !== null && max(v1.v2) < v2)
			return v1.v1.v1;

		if (v1.type == "mul" && v1.v2 == v2)
			return v1.v1;

		return {type: "div", v1, v2};
	};

	const mod = (v1, v2) => {
		if (v1 == 0)
			return 0;

		if (v1.type == "add" && v1.v1.type == "mul" && v1.v1.v2 == v2)
			return mod(v1.v2, v2);

		const min1 = min(v1);
		const max1 = max(v1);
		if (!isNaN(v2) && min1 !== null && max1 !== null && min1 >= 0 && max1 < v2)
			return v1;

		return {type: "mod", v1, v2};
	};

	let customAssumptions = [];

	const eql = (v1, v2) => {
		if (v1 == v2)
			return 1;

		const min1 = min(v1);
		const min2 = min(v2);
		const max1 = max(v1);
		const max2 = max(v2);
		if (min1 !== null && max2 !== null && min1 > max2)
			return 0;
		if (min2 !== null && max1 !== null && min2 > max1)
			return 0;

		for (let [a1, n, a2, v] of customAssumptions) {
			if (n == 0) {
				if (v1 == a1 && v2 == a2)
					return v;
			} else {
				if (v1.type == "add" && v1.v1 == a1 && v1.v2 == n && v2 == a2)
					return v;
			}
		};

		return {type: "eql", v1, v2};
	};

	const min = expression => {
		if (!isNaN(expression)) return expression;
		if (typeof expression == "string") return 1;
		switch (expression.type) {
			case "add": {
				const m1 = min(expression.v1);
				const m2 = min(expression.v2);
				if (m1 !== null && m2 !== null)
					return m1 + m2;
				break;
			}
			case "mul": {
				const min1 = min(expression.v1);
				const min2 = min(expression.v2);
				if (min1 !== null && min2 !== null && min1 >= 0 && min2 >= 0)
					return min1 * min2;
				break;
			}
			case "mod": {
				if (!isNaN(expression.v2))
					return 0;
				break;
			}
			case "eql": return 0;
		}
		// console.log("MIN", expressionToString(expression));
		return null;
	};

	const max = expression => {
		if (!isNaN(expression)) return expression;
		if (typeof expression == "string") return 9;
		switch (expression.type) {
			case "add": {
				const m1 = max(expression.v1);
				const m2 = max(expression.v2);
				if (m1 !== null && m2 !== null)
					return m1 + m2;
				break;
			}
			case "mul": {
				const min1 = min(expression.v1);
				const min2 = min(expression.v2);
				const max1 = max(expression.v1);
				const max2 = max(expression.v2);
				if (min1 !== null && min2 !== null && min1 >= 0 && min2 >= 0 && max1 !== null && max2 !== null)
					return max1 * max2;
				break;
			}
			case "mod": {
				if (!isNaN(expression.v2))
					return expression.v2 - 1;
				break;
			}
			case "eql": return 1;
		}
		// console.log("MAX", expressionToString(expression));
		return null;
	};

	const canBeZero = expression => {
		if (expression.type == "add" && expression.v1.type == "mul" && !isNaN(expression.v1.v2)) {
			const m = min(mod(expression, expression.v1.v2));
			if (m !== null && m > 0)
				return false;
		}
		const m = min(expression);
		if (m !== null && m > 0)
			return false;

		return true;
	};

	const expressionToString = expression => {
		if (!isNaN(expression))
			return `${expression}`;
		if (typeof expression == "string")
			return expression;

		const operator = {
			"add": "+",
			"mul": "×",
			"div": "/",
			"mod": "%",
			"eql": "==",
		}[expression.type];

		return `(${expressionToString(expression.v1)} ${operator} ${expressionToString(expression.v2)})`;
	};

	const getBasicEqualities = expression => {
		if (expression.type == "eql" && typeof expression.v1 == "string" && typeof expression.v2 == "string") {
			return [[expression.v1, 0, expression.v2]];
		} else if (expression.type == "eql" && expression.v1.type == "add" && typeof expression.v1.v1 == "string" && !isNaN(expression.v1.v2) && typeof expression.v2 == "string") {
			return [[expression.v1.v1, expression.v1.v2, expression.v2]];
		} else if (!isNaN(expression) || typeof expression == "string") {
			return [];
		} else {
			const eqs1 = getBasicEqualities(expression.v1);
			const eqs2 = getBasicEqualities(expression.v2);
			const result = [...eqs1];
			eqs2.forEach(eq => {
				if (!result.some(e => JSON.stringify(e) == JSON.stringify(eq)))
					result.push(eq);
			});
			return result;
		}
	};

	// Given a list of assumptions, determines whether it is possible to reach 0
	const process = (assumptions = []) => {
		customAssumptions = assumptions;
		// console.log("Trying " + JSON.stringify(assumptions));

		memory.w = 0;
		memory.x = 0;
		memory.y = 0;
		memory.z = 0;
		currentDigit = 0;

		instructions.forEach(instruction => {
			applyInstruction(instruction);
		});
// 		console.log(`
// w = ${expressionToString(memory.w)}
// x = ${expressionToString(memory.x)}
// y = ${expressionToString(memory.y)}
// z = ${expressionToString(memory.z)}`);

		const zero = canBeZero(memory.z);
		const newAssumption = getBasicEqualities(memory.z)[0];

		// We can’t reach zero, abort
		if (!zero)
			return;

		// No new assumption, this is a solution!
		if (!newAssumption) {
			console.log("Can be zero for\n" + assumptions.map(([a1, v, a2, r]) => `(${a1} + ${v} == ${a2}) == ${r}`).join("\n") + "\nFind the actual solutions by hand.");
		} else {
			process([...assumptions, [...newAssumption, 0]]);
			process([...assumptions, [...newAssumption, 1]]);
		}
	};

	process();
});
