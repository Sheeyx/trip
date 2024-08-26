import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	APARTMENT = 'APARTMENT',
	VILLA = 'VILLA',
	HOUSE = 'HOUSE',
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyLocation {
	TASHKENT = 'TASHKENT',
	NAMANGAN = 'NAMANGAN',
	SAMARKAND = 'SAMARKAND',
	KHOREZM = 'KHOREZM',
	ANDIJON = 'ANDIJON',
	NAVOI = 'NAVOI',
	FERGANA = 'FERGANA',
	TERMEZ = 'TERMEZ',
	BUKHARA = 'BUKHARA',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});