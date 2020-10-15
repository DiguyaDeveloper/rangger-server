import { MigrationInterface, QueryRunner } from 'typeorm';

import { DefaultRole, Role } from '../../api/models/user-models/Role.model';

export class firstMigration1589909805726 implements MigrationInterface {
    name = 'firstMigration1589909805726'

    public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(new Table({
//             name: PUBLIC_TABLES.ROLE,
//             columns: [
//                 { name: 'id', type: COLUMN_TYPES.INT, isPrimary: true, isGenerated: true, generationStrategy: "increment"},
//                 { name: 'name', type: COLUMN_TYPES.VARCHAR, length: '50' }
//             ]
//             }), true);

//         await queryRunner.createTable(new Table({
//             name: PUBLIC_TABLES.USUARIO,
//             columns: [
//                 { name: "id", type: COLUMN_TYPES.INT, isPrimary: true, isGenerated: true, generationStrategy: "increment" },
//                 { name: "fullname", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "username",type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "password", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "email", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "estado", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "pais", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "status", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "picture", type: COLUMN_TYPES.VARCHAR, length: '255' },
//                 { name: "help", type: COLUMN_TYPES.BOOLEAN },
//                 { name: FOREIGN_KEYS.ROLE_ID, type: COLUMN_TYPES.INT },
//                 { name: "termsAndConditions", type: COLUMN_TYPES.BOOLEAN },
//                 { name: "confirmation_code", type: COLUMN_TYPES.INT },
//                 ...createAndUpdateDates
//             ],
//             foreignKeys: [
//                 createForeignKeyOption(FOREIGN_KEYS.ROLE_ID, PUBLIC_TABLES.ROLE),
//             ],
//             indices: [
//                 { name: INDICES.USER_EMAIL, columnNames: ['email'], isUnique: true }
//             ]
//         }), true);

        console.log('************** INSERT DEFAULT DATA ROLE **************')
        const userRole = new Role(DefaultRole.Usuario);
        userRole.name = 'Usuario';
        await queryRunner.manager.save(userRole);
        const adminRole = new Role(DefaultRole.Admin);
        adminRole.name = 'Admin';
        await queryRunner.manager.save(adminRole);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `usuario`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
