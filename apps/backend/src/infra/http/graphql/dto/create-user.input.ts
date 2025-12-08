import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, MaxLength, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../types/user.type';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field(() => UserRoleEnum)
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
