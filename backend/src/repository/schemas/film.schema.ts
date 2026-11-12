import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  { _id: false, id: false },
);

const FilmSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    schedule: { type: [ScheduleSchema], default: [] },
  },
  { id: false, versionKey: false },
);

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    tickets: { type: [mongoose.Schema.Types.Mixed], required: true },
  },
  { id: false, versionKey: false },
);

export const FilmModel =
  mongoose.models.Film || mongoose.model('Film', FilmSchema, 'films');

export const OrderModel =
  mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
