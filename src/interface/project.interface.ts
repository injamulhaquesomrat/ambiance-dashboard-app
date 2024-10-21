export interface IProjects  {
    _id: string;
    title: string;
    url: string;
    subject: string;
    skills: string[];
    description: string;
    images: string[];
    created_by: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
      };
    createdAt: Date,
    updatedAt: Date
  };
