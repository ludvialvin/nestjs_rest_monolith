import { DataSource } from 'typeorm';

export const databaseProviders = [
   {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
         const dataSource = new DataSource({
            type: 'sqlite',
            database: "../../database/sqlite.db",
            entities: [__dirname+'/../**/*.entity{.ts,.js}'],
            synchronize: false,
            migrations: ["../migration/*{.ts,.js}"],
            migrationsTableName: "migrations",
         });

         return dataSource.initialize();
      },
   },
];