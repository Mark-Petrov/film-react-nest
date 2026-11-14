export interface ScheduleEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: ScheduleEntity[];
}

export interface StoredOrder {
  email: string;
  phone: string;
  tickets: Array<{
    id: string;
    film: string;
    session: string;
    daytime: string;
    row: number;
    seat: number;
    price: number;
  }>;
}
