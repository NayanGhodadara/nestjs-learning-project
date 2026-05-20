import moment from 'moment';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/api/user/user.entity';
import { UserType } from 'src/constants/app.constants';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bycrypt from 'bcrypt';

export default class CreateAdminSeeder implements Seeder {

    track: boolean = false;

    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repo = dataSource.getRepository(UserEntity);

        const admin = [
            {
                role: UserType.ADMIN,
                email: 'admin@gmail.com',
                password: 'Admin@123'
            },
            {
                role: UserType.ADMIN,
                email: 'admin2@gmail.com',
                password: 'Admin2@123'
            }
        ]

        for (const user of admin) {
            const existingAdmin = await repo.findOne({ where: { email: user.email } });
            if (!existingAdmin) {
                const pass = await bycrypt.hashSync(user.password, 10);
                const newAdmin = repo.create(
                    {
                        uid: generateUniqueId("U"),
                        ...user,
                        createdAt: dateToTimestamp(moment().toDate()),
                        password: pass
                    }
                );
                await repo.save(newAdmin);
                console.log(`Admin user with email ${user.email} created successfully.`);
            } else {
                console.log(`Admin user with email ${user.email} already exists. Skipping creation.`);
            }
        }
    }
}