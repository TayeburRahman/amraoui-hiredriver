import { z } from 'zod';

const updateDriverStatusSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'declined'], {
      required_error: 'Status is required',
    }),
  }),
});

const updateLocationSchema = z.object({
  body: z.object({
    longitude: z
      .number({ required_error: 'Longitude is required' })
      .min(-180)
      .max(180),
    latitude: z
      .number({ required_error: 'Latitude is required' })
      .min(-90)
      .max(90),
  }),
});

export const DriverValidation = {
  updateDriverStatusSchema,
  updateLocationSchema,
};
