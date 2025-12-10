import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokensType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
