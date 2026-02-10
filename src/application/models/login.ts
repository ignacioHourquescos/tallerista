export interface LoginDto {
  numCliente: string;
  password: any;
}
export interface LoginResponseDto {
  readonly id: string;
  readonly clientId: number;
  readonly roles: string[];
  readonly email: string;
  readonly name: string;
  readonly token: string;
  readonly address: string;
  readonly city: string;
  readonly phone: string;
  readonly type: string;
  readonly fiscalValue: string;
  readonly preference: string;
  readonly listCode: string;
}
