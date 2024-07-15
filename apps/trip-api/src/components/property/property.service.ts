import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Properties, Property } from '../../libs/dto/property/property';
import { PropertiesInquiry, PropertyInput } from '../../libs/dto/property/property.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier } from '../../libs/types/common';
import moment from 'moment';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class PropertyService {
    constructor(@InjectModel('Property') 
    private readonly propertyModel: Model<Property>,
    private readonly memberService: MemberService,
    private viewService: ViewService,
    ){}

    public async createProperty(input: PropertyInput): Promise<Property> {
        try {
            const result = await this.propertyModel.create(input);
            await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProperties',
				modifier: 1,
			});
            return result
        } catch (err) {
			console.log("Error, Service model: ",err.message);
			throw new BadRequestException(Message.CREATE_FAILED );
		}
    }

    //   GET PROPERTY

    public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
        const search = {
          _id: propertyId,
          propertyStatus: PropertyStatus.ACTIVE,
        };
    
        const targetProperty: Property = await this.propertyModel.findOne(search).lean().exec();
    
        if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    
        if (memberId) {
          const viewInput = {
            memberId: memberId,
            viewRefId: propertyId,
            viewGroup: ViewGroup.PROPERTY,
          };
    
          const newView = await this.viewService.recordView(viewInput);
    
          if (newView) {
            await this.propertyStatsEditor({
              _id: propertyId,
              targetKey: 'propertyViews',
              modifier: 1,
            });
            targetProperty.propertyViews++;
          }

          // meLiked
    
        }

        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        return targetProperty;
      }
    
      public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
        const { _id, targetKey, modifier } = input;
    
        return await this.propertyModel.findByIdAndUpdate(
          _id,
          { $inc: { [targetKey]: modifier } },
          { new: true },
        ).exec();
      }

    //   UPDATE PROPERTY

      public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
        let { propertyStatus, soldAt, deletedAt } = input;
        
        const search = {
          _id: input._id,
          memberId: memberId,
          propertyStatus: PropertyStatus.ACTIVE,
        };
    
        if (propertyStatus === PropertyStatus.SOLD) {
          soldAt = moment().toDate();
        } else if (propertyStatus === PropertyStatus.DELETE) {
          deletedAt = moment().toDate();
        }
    
        const result = await this.propertyModel
          .findOneAndUpdate(search, input, {
            new: true,
          })
          .exec();
    
        if (!result) throw new InternalServerErrorException('Update failed');
    
        if (soldAt || deletedAt) {
          await this.memberService.memberStatsEditor({
            _id: memberId,
            targetKey: 'memberProperties',
            modifier: -1,
          });
        }
    
        return result;
      }

      public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
        const match: any = { propertyStatus: PropertyStatus.ACTIVE };
        const sort: any = {
          [input.sort ?? 'createdAt']: input.direction ?? 'DESC'
        };
        this.shapeMatchQuery(match, input);
        console.log('match:', match);
    
        const result = await this.propertyModel.aggregate([
          { $match: match },
          { $sort: sort },
          { $facet: {
              list: [
                { $skip: (input.page - 1) * input.limit },
                { $limit: input.limit }
              ],
              metaCounter: [{ $count: 'total' }]
            }
          }
        ]).exec();
    
        if (!result.length) {
          throw new InternalServerErrorException('No data found.');
        }
    
        return result[0];
      }
    
      private shapeMatchQuery(match: any, input: PropertiesInquiry): void {
        const {
          memberId,
          locationList,
          roomsList,
          bedsList,
          typeList,
          periodsRange,
          pricesRange,
          squaresRange,
          options,
          text,
        } = input.search;
      
        if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
        if (locationList) match.propertyLocation = { $in: locationList };
        if (roomsList) match.propertyRooms = { $in: roomsList };
        if (bedsList ) match.propertyBeds = { $in: bedsList };
        if (typeList) match.propertyType = { $in: typeList };
      
        if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
        if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
        if (squaresRange) match.propertySquare = { $gte: squaresRange.start, $lte: squaresRange.end };
      
        if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };
        if (options) {
          match['$or'] = options.map((ele: string) => {
            return { [ele]: true };
          });
        }
      }

}