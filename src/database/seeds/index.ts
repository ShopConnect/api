import { InitialSeed20200321 } from "./20200321-initial.seed";
import { Seed } from "../entities/seed.entity";

export function getSeedTypes(): typeof Seed[] {
    return [
        InitialSeed20200321
    ];
};