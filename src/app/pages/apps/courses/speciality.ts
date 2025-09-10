import { course } from './course';

export interface speciality {
  _id?: string;
  title: string;
  description?: string;
  courses?: course[];
}