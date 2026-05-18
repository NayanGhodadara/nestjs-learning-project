import { AddressDto } from './address.dto';
import { BadRequestException, Injectable } from "node_modules/@nestjs/common";
import { Repository } from "node_modules/typeorm";
import { AddressEntity } from "./address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressType } from 'src/constants/app.constants';
import { generateUniqueId } from 'src/utils/app.utils';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private addressRepository: Repository<AddressEntity>
    ) { }

    async createAddress(addressDto: AddressDto, uid: string) {
        if (!addressDto.address) {
            throw new BadRequestException("Address is required");
        }

        if (!addressDto.latitude) {
            throw new BadRequestException("Latitude is required");
        }

        if (!addressDto.longitude) {
            throw new BadRequestException("Longitude is required");
        }

        if (!addressDto.addressType) {
            throw new BadRequestException("Address type is required");
        }

        if (Object.values(AddressType).indexOf(addressDto.addressType) === -1) {
            throw new BadRequestException("Invalid address type");
        }

        let address = {
            aid: generateUniqueId("A"),
            user: { uid: uid } as any,
            address: addressDto.address,
            latitude: addressDto.latitude,
            longitude: addressDto.longitude,
            isDefault: addressDto.isDefault,
            addressType: addressDto.addressType
        }

        let result = await this.addressRepository.save(address);
        let { user, ...addressDetails } = result;
        return addressDetails;
    }

    async getAllAddress(uid: string, filter: AddressType, count: number, limit: number) {
        const skip = Number(count) || 0;
        const take = Number(limit) || 10;

        const query = this.addressRepository
            .createQueryBuilder("address")
            .where("address.uid = :uid", { uid })


        if (filter) {
            query.andWhere("address.addressType = :filter", { filter })
        }

        const [data, total] = await query
            .skip(skip)
            .take(take)
            .getManyAndCount();

        return { data, total };
    }

    async deleteAddress(aid: string, uid: string) {
        const address = await this.addressRepository
            .createQueryBuilder("address")
            .innerJoin("address.user", "user")
            .where("user.uid = :uid", { uid })
            .andWhere("address.aid = :aid", { aid })
            .getOne();

        if (!address) {
            throw new BadRequestException("Address not found");
        }

        await this.addressRepository.remove(address);
    }

    async updateAddress(aid: string, addressDto: AddressDto, uid: string) {
        const address = await this.addressRepository
            .findOne({
                where: { aid, user: { uid } }
            })

        if (!address) {
            throw new BadRequestException("Address not found");
        }

        if (addressDto.isDefault == true) {
            await this.addressRepository
                .update(
                    {
                        user: { uid },
                        isDefault: true
                    },
                    {
                        isDefault: false
                    }
                )
        }

        const { aid: _, ...safeDto } = addressDto;
        await this.addressRepository
            .update(
                {
                    aid: aid,
                    user: { uid }
                },
                {
                    ...safeDto
                }
            )

        const updated = await this.addressRepository.findOne({
            where: { aid, user: { uid } }
        });

        return updated
    }

    async findAddressById(aid) {
        const result = this.addressRepository.findOne(
            {
                where: { aid: aid }
            }
        );
        return result;
    }
}