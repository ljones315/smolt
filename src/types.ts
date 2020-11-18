export interface Result {
  name: string;
  value: number;
  message: string;
}

export interface Comment {
  id: number;
  text: string;
  results: Result[];
  removed: boolean;
  custom: boolean;
}
