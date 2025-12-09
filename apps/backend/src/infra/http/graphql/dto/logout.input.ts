import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LogoutInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
