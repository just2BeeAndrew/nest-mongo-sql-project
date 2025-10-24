export class RefreshContextDto {
  id: string;
  deviceId: string;
  iat?: number;
  exp?: number;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };