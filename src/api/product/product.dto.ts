import { ApiProperty } from "node_modules/@nestjs/swagger/dist"

export class ProductDto {
    pid!: string

    @ApiProperty({ example: "test" })
    name!: string

    @ApiProperty({ example: "test" })
    description!: string

    @ApiProperty({ example: ['test.png'] })
    media!: string[]

    @ApiProperty({ example: 20 })
    mrp!: number

    @ApiProperty({ example: 10 })
    price!: number
}