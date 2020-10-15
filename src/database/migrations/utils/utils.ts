import { compare, hash } from 'bcrypt';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
import { TableForeignKeyOptions } from 'typeorm/schema-builder/options/TableForeignKeyOptions';

export const encryptPassword = function (password: string) : Promise<string> {
  const saltRounds = 10
  return hash(password, saltRounds)
}

export const comparePassword = async (password: string, hash: string) : Promise<boolean> => {
  return compare(password, hash)
}

  export const FOREIGN_KEYS = {
    ROLE_ID: 'roleId',
    USER_ID: 'userId',
    DOCUMENT_TYPE_ID: 'documentTypeId'
  }
  export const INDICES = {
    USER_EMAIL: 'IDX_USER_EMAIL'
  }
  export const COLUMN_TYPES = {
    INT: 'int',
    TEXT: 'text',
    VARCHAR: 'varchar',
    BOOLEAN: 'boolean',
    TIMESTAMP_UTC: 'timestamp'
  }

  export const createAndUpdateDates: TableColumnOptions[] = [
    { name: 'createDate', type: COLUMN_TYPES.TIMESTAMP_UTC, default: 'NOW()' },
    { name: 'updateDate', type: COLUMN_TYPES.TIMESTAMP_UTC, default: 'NOW()' }
  ]

  export const createForeignKeyOption = (
    columnName: string,
    tableName: string,
    columnId = 'id'
  ): TableForeignKeyOptions => {
    return {
      columnNames: [columnName],
      referencedColumnNames: [columnId],
      referencedTableName: tableName,
      onDelete: "CASCADE"
    }
  }

  export const PUBLIC_TABLES = {
    USUARIO: 'usuario',
    ROLE: 'role',
    STATUS: 'status',
    STATE: 'state',
    COUNTRY: 'country'
  }

  export function EnumToArray(enumeration: any): string[] {
    return Object.keys(enumeration).map(key => enumeration[key])
  }
