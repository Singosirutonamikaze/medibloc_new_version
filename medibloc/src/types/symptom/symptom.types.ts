export interface Symptom {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSymptomDto {
  name: string;
  description?: string;
}

export interface UpdateSymptomDto {
  name?: string;
  description?: string;
}
