export interface course {
  _id?: string;          // MongoDB sends _id
  title: string;
  description?: string;
  pdfUrl?: string;       // link or file path
  speciality: string;   // speciality ID
}