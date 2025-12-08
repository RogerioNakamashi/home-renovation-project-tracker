import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  HOMEOWNER = 'HOMEOWNER',
  CONTRACTOR = 'CONTRACTOR',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
  description: 'The role of the user in the system',
});

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRoleEnum)
  role: UserRoleEnum;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
