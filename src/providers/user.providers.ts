import { DataSource } from 'typeorm';
import { User, UsersGroup, UserPermission} from '../entity/user.entity';

export const userProviders = [
   {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
   },
   {
      provide: 'USER_GROUP_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(UsersGroup),
      inject: ['DATA_SOURCE'],
   },
   {
      provide: 'USER_PERMISSIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(UserPermission),
      inject: ['DATA_SOURCE'],
   },
];