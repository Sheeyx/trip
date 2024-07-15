import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { MemberType } from '../../libs/enums/member.enum';
import { PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Properties, Property } from '../../libs/dto/property/property';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PropertyUpdate } from '../../libs/dto/property/property.update';

@Resolver()
export class PropertyResolver {
    constructor(private readonly propertyService: PropertyService){}

    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Property)
    public async createProperty(
        @Args('input') input: PropertyInput,
        @AuthMember('_id') memberId: ObjectId,
        ): Promise<Property> {
            console.log('Mutation, createProperty');
            input.memberId = memberId;
            return await this.propertyService.createProperty(input);
        }
        

    @UseGuards(WithoutGuard)
    @Query((returns) => Property)
    public async getProperty(
        @Args('propertyId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Property> {
        console.log('Query: getProperty');
        const propertyId = shapeIntoMongoObjectId(input);
        return await this.propertyService.getProperty(memberId, propertyId);
    }

    
    // AGENTS can use this GraphQL API

    @Roles(MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Mutation(returns => Property)
    public async updateProperty(
        @Args('input') input: PropertyUpdate,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Property> {
        console.log('Mutation: updateProperty');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.propertyService.updateProperty(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Properties)
    public async getProperties(
        @Args('input') input: PropertiesInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Properties> {
        console.log('Query: getProperties');
        return await this.propertyService.getProperties(memberId, input);
    }
} 