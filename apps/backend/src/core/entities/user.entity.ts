import { randomUUID } from 'crypto';

export enum UserRole {
  HOMEOWNER = 'HOMEOWNER',
  CONTRACTOR = 'CONTRACTOR',
}

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: Required<UserProps>) {
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: UserProps): UserEntity {
    return new UserEntity({
      id: props.id ?? randomUUID(),
      email: props.email,
      name: props.name,
      passwordHash: props.passwordHash,
      role: props.role,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  update(props: Partial<Pick<UserProps, 'name'>>): UserEntity {
    return new UserEntity({
      id: this.id,
      email: this.email,
      name: props.name ?? this.name,
      passwordHash: this.passwordHash,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  isHomeowner(): boolean {
    return this.role === UserRole.HOMEOWNER;
  }

  isContractor(): boolean {
    return this.role === UserRole.CONTRACTOR;
  }
}
