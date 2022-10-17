import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class migration1665842087017 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'users_group_id',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
            },
            {
                name: 'password',
                type: 'varchar',
                isNullable: false,
              },
          ],
        }),
        false,
    );

    await queryRunner.query(`INSERT INTO user (name,password,users_group_id) VALUES ('superadmin','$2a$10$6x81Z5jxljjGoZiPXcdEiOPKnPQEYetPxZkGOaLd/GCKXuBvwH7Vu','1')`);
      
    await queryRunner.createTable(
      new Table({
        name: 'user_group',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'string',
            isNullable: true,
          },
          {
            name: 'created_date',
            type: 'datetime',
            isNullable: true,
          },
          {
              name: 'modified_date',
              type: 'datetime',
              isNullable: true,
          },
          {
              name: 'is_deleted',
              type: 'int',
              default: '0',
          },
        ],
      }),
      false,
  );
  
  let dateTime = '2022-01-01'
  
  await queryRunner.query(`INSERT INTO user_group (name,created_date,modified_date,is_deleted) VALUES ('admin',`+dateTime+`,'','0')`);
  await queryRunner.query(`INSERT INTO user_group (name,created_date,modified_date,is_deleted) VALUES ('user',`+dateTime+`,'','0')`);

  await queryRunner.createTable(
    new Table({
      name: 'user_permissions',
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'user_group_id',
          type: 'int',
          isNullable: true,
        },
        {
            name: 'path',
            type: 'string',
            isNullable: true,
        },
        {
            name: 'action',
            type: 'string',
            isNullable: true,
        },
        {
            name: 'is_active',
            type: 'int',
            default: '0',
        },
        {
            name: 'created_date',
            type: 'datetime',
            isNullable: true,
        },
        {
            name: 'modified_date',
            type: 'datetime',
            isNullable: true,
        },
      ],
    }),
    false,
);

//let dateTime = new Date()

await queryRunner.query(`INSERT INTO user_permissions (user_group_id,path,action,created_date,is_active) VALUES ('1','user','get',`+dateTime+`,'1')`);
await queryRunner.query(`INSERT INTO user_permissions (user_group_id,path,action,created_date,is_active) VALUES ('1','user','getOne',`+dateTime+`,'1')`);
await queryRunner.query(`INSERT INTO user_permissions (user_group_id,path,action,created_date,is_active) VALUES ('1','user','create',`+dateTime+`,'1')`);
await queryRunner.query(`INSERT INTO user_permissions (user_group_id,path,action,created_date,is_active) VALUES ('1','user','update',`+dateTime+`,'1')`);
await queryRunner.query(`INSERT INTO user_permissions (user_group_id,path,action,created_date,is_active) VALUES ('1','user','delete',`+dateTime+`,'1')`);

await queryRunner.createTable(
  new Table({
    name: 'auth',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'user_id',
        type: 'int',
        isNullable: true,
      },
      {
          name: 'token',
          type: 'string',
          isNullable: true,
      },
      {
          name: 'refresh_token',
          type: 'string',
          isNullable: true,
      },
      {
          name: 'created_date',
          type: 'datetime',
          isNullable: true,
      },
      {
          name: 'modified_date',
          type: 'datetime',
          isNullable: true,
      },
      {
        name: 'is_deleted',
        type: 'int',
        default: '0',
      },
    ],
  }),
  false,
); 

await queryRunner.createTable(
  new Table({
    name: 'ref_permissions',
    columns: [
      {
        name: 'id',
        type: 'integer',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'name',
        type: 'string',
        isNullable: true,
      },
      {
          name: 'created_date',
          type: 'datetime',
          isNullable: true,
      },
      {
          name: 'modified_date',
          type: 'datetime',
          isNullable: true,
      },
      
      {
        name: 'is_deleted',
        type: 'int',
        default: '0',
      },
    ],
  }),
  false,
);
      await queryRunner.query(`INSERT INTO ref_permissions (name,created_date) VALUES ('user',`+dateTime+`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      queryRunner.query(`DROP TABLE user`);
      queryRunner.query(`DROP TABLE user_group`);
      queryRunner.query(`DROP TABLE user_permissions`);
      queryRunner.query(`DROP TABLE auth`);
      queryRunner.query(`DROP TABLE ref_permissions`);
    }

}
