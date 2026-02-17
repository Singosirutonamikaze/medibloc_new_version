export interface Country {
  id: number;
  name: string;
  code?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name: string;
  code?: string;
}

export interface UpdateCountryDto {
  name?: string;
  code?: string;
}
