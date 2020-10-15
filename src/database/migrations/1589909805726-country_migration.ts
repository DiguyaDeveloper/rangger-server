import { Country } from 'src/api/models';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { ListCountries } from '../../api/shared/enum/contries.enum';

// import { COLUMN_TYPES, createAndUpdateDates, PUBLIC_TABLES } from './utils/utils';

export class countryMigration1589909805726 implements MigrationInterface {
  name = 'countryMigration1589909805726'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createTable(new Table({
    //   name: PUBLIC_TABLES.COUNTRY,
    //   columns: [
    //       { name: 'id', type: COLUMN_TYPES.INT, isPrimary: true, isGenerated: true, generationStrategy: "increment"},
    //       { name: 'name', type: COLUMN_TYPES.VARCHAR, length: '50' },
    //       { name: 'code', type: COLUMN_TYPES.VARCHAR, length: '2' },
    //       ...createAndUpdateDates
    //   ]
    //   }), true);

      console.log('************** INSERT DEFAULT DATA COUNTRY **************')

      ListCountries.forEach(async element => {
        const country = new Country(element.name, element.cod);
        await queryRunner.manager.save(country);
      });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `country`", undefined);
  }

}
