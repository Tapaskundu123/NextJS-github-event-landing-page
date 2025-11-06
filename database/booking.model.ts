import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  EventDetails:string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) =>
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            v
          ),
        message: "Please provide a valid email address",
      },
    },
    EventDetails:{
      type: String,
      required:[true,"Event details are required"]
    }
  },
  { timestamps: true }
);

/* pre-save hook – keep it, it’s a nice safety net */
BookingSchema.pre("save", async function (next) {
  if (this.isModified("eventId") || this.isNew) {
    const exists = await Event.findById(this.eventId).select("_id");
    if (!exists) return next(new Error(`Event ${this.eventId} does not exist`));
  }
  next();
});

/* Indexes – keep them */
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);
export default Booking;