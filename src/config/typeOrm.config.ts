import { DataSource } from 'typeorm';
import { migration1665842087017 } from '../migration/1665842087017-migration';
 
export default new DataSource({
    type: 'sqlite',
    database: "../../database/sqlite.db",
    migrations: [migration1665842087017],
    migrationsTableName: "migrations",
});