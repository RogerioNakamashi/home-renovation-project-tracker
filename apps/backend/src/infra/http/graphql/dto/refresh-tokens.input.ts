import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshTokensInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
