export interface IService {
  _id: string;
  title: string;
  description: string;
  banner: string;
  thumbnail: string;
  reviews: number;
  rating: number;
  images: string[];
  created_by: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}
