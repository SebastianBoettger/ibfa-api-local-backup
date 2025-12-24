export type UserType = 'internal';

export type JwtPayloadInternal = {
  sub: string;              // internalUser.id
  type: 'internal';
  role: string;
};

export type JwtPayload = JwtPayloadInternal;
