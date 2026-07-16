import { z } from "zod";

// --- CREATE ACCOUNT VALIDATION ---
const create = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, "Confirm Password must be at least 6 characters long"),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(["CUSTOMERS", "DRIVER", "ADMIN", "SUPER_ADMIN"]),
    // Driver-specific optional fields
    license_number: z.string().optional(),
    vehicle_type: z.string().optional(),
    vehicle_plate: z.string().optional(),
    company_name: z.string().optional(),
    tax_number: z.string().optional(),
    vehicle_carrier_image: z.string().optional(),
    dealer_plate_image: z.string().optional(),
    profile_image: z.string().optional(),
    id_document_front: z.string().optional(),
    id_document_back: z.string().optional(),
    license_document_front: z.string().optional(),
    license_document_back: z.string().optional(),
  }),
});

// --- UPDATE USER PROFILE ---
const updateUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name cannot be empty")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    phone_number: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    address: z.string().optional(),
    profile_image: z.string().optional(),
    role: z.enum(["CUSTOMERS", "DRIVER", "ADMIN", "SUPER_ADMIN"]).optional(),
    date_of_birth: z.string().optional(),
    // Driver-specific optional fields
    license_number: z.string().optional(),
    vehicle_type: z.string().optional(),
    vehicle_plate: z.string().optional(),
    company_name: z.string().optional(),
    tax_number: z.string().optional(),
    vehicle_carrier_image: z.string().optional(),
    dealer_plate_image: z.string().optional(),
    id_document_front: z.string().optional(),
    id_document_back: z.string().optional(),
    license_document_front: z.string().optional(),
    license_document_back: z.string().optional(),
  }),
});

// --- LOGIN ---
const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

// --- REFRESH TOKEN ---
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Refresh Token is required" }),
  }),
});

// --- BLOCK / UNBLOCK ---
const blockUnblockUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    role: z.enum(["CUSTOMERS", "DRIVER", "ADMIN", "SUPER_ADMIN"], {
      required_error: "Role is required",
    }),
    is_block: z.boolean({ required_error: "is_block flag is required" }),
  }),
});

export const AuthValidation = {
  create,
  updateUserZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  blockUnblockUserZodSchema,
};
