import { DataSource } from 'typeorm';
import { Auth, RefPermissions } from '../entity/auth.entity';

export const authProviders = [
   {
      provide: 'AUTH_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Auth),
      inject: ['DATA_SOURCE'],
   },
   {
      provide: 'REF_PERMISSIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(RefPermissions),
      inject: ['DATA_SOURCE'],
   },
];