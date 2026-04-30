export type Class = {
  _id: string;
  name: string;
  teacher: {
    _id: string;
    name: string;
  };
  students: {
    _id: string;
    name: string;
  }[];
};