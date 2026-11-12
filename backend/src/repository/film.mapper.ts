import { FilmEntity, ScheduleEntity } from './film.entity';

export function toScheduleEntity(raw: Record<string, unknown>): ScheduleEntity {
  return {
    id: String(raw.id),
    daytime: String(raw.daytime),
    hall: Number(raw.hall),
    rows: Number(raw.rows),
    seats: Number(raw.seats),
    price: Number(raw.price),
    taken: Array.isArray(raw.taken) ? raw.taken.map(String) : [],
  };
}

export function toFilmEntity(raw: Record<string, unknown>): FilmEntity {
  const schedule = Array.isArray(raw.schedule) ? raw.schedule : [];

  return {
    id: String(raw.id),
    rating: Number(raw.rating),
    director: String(raw.director ?? ''),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    title: String(raw.title ?? ''),
    about: String(raw.about ?? ''),
    description: String(raw.description ?? ''),
    image: String(raw.image ?? ''),
    cover: String(raw.cover ?? ''),
    schedule: schedule.map((item) =>
      toScheduleEntity(item as Record<string, unknown>),
    ),
  };
}
