import { z } from 'zod';

const updateDriverStatusSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'declined'], {
      required_error: 'Status is required',
    }),
    reason: z.string().optional(),
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

const updateSkillsSchema = z.object({
  body: z.object({
    skills: z.array(
      z.object({
        name: z.string({ required_error: 'Skill name is required' }),
        stars: z.number().min(1).max(5),
      })
    ),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
});

export const DriverValidation = {
  updateDriverStatusSchema,
  updateLocationSchema,
  updateSkillsSchema,
  updateProfileSchema,
};
