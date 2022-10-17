import { paginateRaw } from 'nestjs-typeorm-paginate';
import { getConnection } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

/*
--- example options ---

const options = {
    "result": "paginated",
    "table": {
        "entity": "Article",
        "alias": "a"
    },
    "select": [
        {"name": "a.id", "alias": "id"},
        {"name": "a.title", "alias": "title"},
        {"name": "a.slug", "alias": "slug"},
        {"name": "u.name", "alias": "author_name"}
    ],
    "join": [
        {
            "entity": "Users",
            "alias": "u",
            "on": "u.id=a.author_id",
            "type": "left"
        }
    ],
    "where": [
        {
            "column": "a.is_deleted",
            "value": "0"
        }
    ],
    "where_like": [
        {
            "column": "u.name",
            "value": "admin",
            "type": "both"
        }
    ],
    "sortableColumns": ['id', 'title', 'slug'],
    "searchableColumns": ['title', 'slug'],
}
*/

//export async function qbHelper(params,queryBuilder,options){
export async function qbHelper(params,options){ 
    const defaultOption = {
        page: params.page ? parseInt(params.page.toString(), 10) : 1,
        limit: params.limit ? parseInt(params.limit.toString(), 10) : 10,
        route: undefined
    }

    const connection = getConnection();
    const queryBuilder = connection.createQueryBuilder()

    if(options.table){
        const table = options.table;
        queryBuilder.from(table.entity,table.alias)
    }

    if(options.select){
        const selects = options.select;
        for (const select of selects) {
            queryBuilder.addSelect(select.name,select.alias)
        }    
    } 
    
    if(options.join){
        const joins = options.join;
        for (const join of joins) {
            if(join.type == 'left'){
                queryBuilder.leftJoin(join.entity,join.alias,join.on)
            }
            else if(join.type == 'inner'){
                queryBuilder.innerJoin(join.entity,join.alias,join.on)
            }
            else{
                queryBuilder.leftJoin(join.entity,join.alias,join.on)
            }
        }    
    } 

    if(options.where){
        const where = options.where;
        where.forEach((data, index) => {
            const whString = data.column+' = "'+data.value+'"'
            if(index == 0){
                queryBuilder.where(whString)
            }else{
                queryBuilder.andWhere(whString)
            }
        });
    }

    if(options.where_like){
        const where_likes = options.where_like;
        for (const wl of where_likes) {
            if(wl.type == 'left'){
                const whString = wl.column.concat(" like "+`'%${wl.value}'`);
                queryBuilder.andWhere(whString)
            }
            else if(wl.type == 'right'){
                const whString = wl.column.concat(" like "+`'${wl.value}%'`);
                queryBuilder.andWhere(whString)
            }
            else if(wl.type == 'both'){
                const whString = wl.column.concat(" like "+`'%${wl.value}%'`);
                queryBuilder.andWhere(whString)
            }
            else{
                const whString = wl.column.concat(" like "+`'%${wl.value}%'`);
                queryBuilder.andWhere(whString)
            }
        }    
    } 

    const searchColumns = []
    const searchableColumns = options.searchableColumns ? options.searchableColumns : ['id'];
    
    for (const column of searchableColumns) {
        searchColumns.push(column)
    }

    const sortColumns = []
    const sortableColumns = options.sortableColumns ? options.sortableColumns : ['id'];



    if (params.search && searchColumns.length) {
        var whSearchString = "("; 
        searchColumns.forEach((columnName, index) => {
            if(index == 0){
                whSearchString = whSearchString+columnName+" like "+`'%${params.search}%'`;
            }else{
                whSearchString = whSearchString+" OR "+columnName+" like "+`'%${params.search}%'`;
            }
        });
        whSearchString = whSearchString+")";
        queryBuilder.andWhere(whSearchString)
    }

    if (params.orderBy) {
        if(params.sort){
            params.sort = params.sort.toUpperCase()
            queryBuilder.addOrderBy(params.orderBy,params.sort)
        }else{
            queryBuilder.addOrderBy(params.orderBy, "ASC")
        }
    } else {
        if(params.sort){
            params.sort = params.sort.toUpperCase()
            queryBuilder.addOrderBy("id", params.sort)
        }
        else{
            queryBuilder.addOrderBy("id", "ASC")
        }
    }   

    if(options.result){
        const result = options.result;

        if(result == 'paginated'){
            return await paginateRaw(queryBuilder, defaultOption);
        }
        else if(result == 'getOne'){
            return await queryBuilder.getOne();
        }
        else if(result == 'getRawOne'){
             const resData = await queryBuilder.getRawOne();
             return instanceToPlain(resData);
        }
        else if(result == 'getMany'){
            return await queryBuilder.getMany();
        }
        else if(result == 'getRawMany'){
            const resData = await queryBuilder.getRawMany();
            return instanceToPlain(resData);
        }
        else if(result == 'getSql'){
            return await queryBuilder.getSql();
        }
        else{
            const resData = await queryBuilder.getRawMany();
            return instanceToPlain(resData);
        }
    }else{
        return await paginateRaw(queryBuilder, defaultOption);
    }
}