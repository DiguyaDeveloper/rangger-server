
import { State } from 'src/api/models';
import { ListStatesOfBrasil } from 'src/api/shared/enum/state-of-brazil.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

// import { COLUMN_TYPES, createAndUpdateDates, PUBLIC_TABLES } from './utils/utils';

export class stateOfBrazilMigration1589909805726 implements MigrationInterface {
  name = 'stateOfBrazilMigration1589909805726'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createTable(new Table({
    //   name: PUBLIC_TABLES.STATE,
    //   columns: [
    //       { name: 'id', type: COLUMN_TYPES.INT, isPrimary: true, isGenerated: true, generationStrategy: "increment"},
    //       { name: 'name', type: COLUMN_TYPES.VARCHAR, length: '50' },
    //       { name: 'code', type: COLUMN_TYPES.VARCHAR, length: '2' },
    //       { name: 'countryId', type: COLUMN_TYPES.INT, length: '4' },
    //       ...createAndUpdateDates
    //   ]
    //   }), true);

      console.log('************** INSERT DEFAULT DATA COUNTRY **************')

      ListStatesOfBrasil.forEach(async element => {
        const state = new State(element.name, element.code, 32);
        await queryRunner.manager.save(state);
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `state`", undefined);
  }
}
