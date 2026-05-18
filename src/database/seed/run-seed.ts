import { databaseSourceOption, dataSource } from './../database-source';
import { runSeeders } from 'typeorm-extension';
import CreateAdminSeeder from './admin-seed';

export const runSeed = async () => {
    console.log('🌱 Running seeds...');

    await dataSource.initialize()

    await runSeeders(dataSource, {
        seeds: [
            CreateAdminSeeder
        ]
    });
    console.log('✅ Seeding completed');
}

runSeed();