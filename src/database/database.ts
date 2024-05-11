import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "odm_user",
    password: "odm_password",
    database: "odm",
    logging: true, 
    synchronize: true,
    entities: [
        "src/database/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ],
})