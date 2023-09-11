export class RandomGenerator {
    public constructor(private seed: number) {
    }

    public random(): number {
        const max = Math.pow(2, 31) - 1;
        this.seed = (1103515245 * this.seed + 12345) % max;
        return this.seed / max;
    }
}
