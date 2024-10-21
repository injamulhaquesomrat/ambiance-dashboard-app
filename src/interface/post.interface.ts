export interface IPosts {
  _id: string;
  title: string;
  images: string[];
  banner: string;
  description: string;
  subtitle: string;
  created_by: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
