// Generator for unique IDs
function* idGenerator() {
    let id = 0;
    while (true) {
        yield ++id;
    }
}
const idGen = idGenerator();
export const getNewID = () => idGen.next().value as number;

export function snapTo(value: number, step: number, option: "floor" | "ceil" | "round" = "round") {
    if (option === "floor") {
        return Math.floor(value / step) * step;
    }
    if (option === "round") {
        return Math.round(value / step) * step;
    }

    return Math.ceil(value / step) * step;
}
