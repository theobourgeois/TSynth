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

/**
 * Set an interval that will call the callback function every duration ms
 * @param callback callback function. receives the current ms
 * @param duration duration in ms
 */
export function setContinuousInterval(callback: (currentMs: number) => void, duration: number) {
    const fullDuration = duration * 2;
    return setInterval(() => {
        const startTime = new Date().getTime();
        const expectedEndTime = startTime + fullDuration;
        let elapsedMs = 0;
        let isIncreasing = true;
        const innerInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            if (currentTime > startTime + duration || elapsedMs >= duration) {
                isIncreasing = false;
            }
            callback(elapsedMs)

            if (isIncreasing) {
                elapsedMs++;
            } else {
                elapsedMs--;
            }
            if (elapsedMs <= 0 || currentTime >= expectedEndTime) {
                clearInterval(innerInterval);
            }
        }, 1);
    }, fullDuration);
}