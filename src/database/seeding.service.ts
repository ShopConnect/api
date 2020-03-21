import { Connection, Repository } from 'typeorm';

import { DatabaseService } from './database.service';
import { Seed } from './entities/seed.entity';
import { getSeedTypes } from './seeds';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedingService {
    private readonly seeds: Seed[];

    private readonly seedRepository: Repository<Seed>;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly connection: Connection
    ) {
        this.seedRepository = this.databaseService.seedRepository;
        this.seeds = this.getSeeds();
    }

    async up(): Promise<void> {
        let pendingSeeds = await this.getPendingSeeds();

        for (let i = 0; i < pendingSeeds.length; i++) {
            const pendingSeed = pendingSeeds[i];
            await pendingSeed.up();

            await this.seedRepository.insert(pendingSeed);
        }
    }
    
    async down(): Promise<void> {
        let finishedSeeds = await this.getFinishedSeeds();

        for (let i = finishedSeeds.length - 1; i > 0; i--) {
            const finishedSeed = finishedSeeds[i];
            await finishedSeed.down();

            await this.seedRepository.remove(finishedSeed);
        }
    }
    
    private getSeeds(): Seed[] {
        let types = getSeedTypes();

        return <Seed[]>types.map((type) => new (<any>type)(this.connection));
    }
    
    private async getPendingSeeds(): Promise<Seed[]> {
        const availableSeeds = this.seeds;

        let seeds = await this.connection.createQueryBuilder()
            .select("seed")
            .from(Seed, "seed")
            .getMany();

        return availableSeeds.filter(available => seeds.every(seed => seed.guid != available.guid));
    }
    
    private async getFinishedSeeds(): Promise<Seed[]> {
        const availableSeeds = this.seeds;

        let seeds = await this.connection.createQueryBuilder()
            .select("seed")
            .from(Seed, "seed")
            .getMany();

        return availableSeeds.filter(available => seeds.every(seed => seed.guid == available.guid));
    }
}
