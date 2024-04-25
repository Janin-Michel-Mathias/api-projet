import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string


    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}