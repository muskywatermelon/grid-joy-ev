import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone_no: z.string().trim().min(1, "Phone number is required").max(20, "Phone number must be less than 20 characters"),
  address: z.string().trim().min(1, "Address is required").max(255, "Address must be less than 255 characters"),
});

export const companySchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  branch: z.string().trim().min(1, "Branch is required").max(100, "Branch must be less than 100 characters"),
});

export const evInfoSchema = z.object({
  num_plate: z.string().trim().min(1, "Number plate is required").max(20, "Number plate must be less than 20 characters"),
  specs: z.string().trim().min(1, "Specs are required").max(500, "Specs must be less than 500 characters"),
  model: z.string().trim().min(1, "Model is required").max(100, "Model must be less than 100 characters"),
  battery_time: z.string().trim().min(1, "Battery time is required"),
  volt_req: z.coerce.number().positive("Voltage must be positive").max(10000, "Voltage must be less than 10000"),
  cost: z.coerce.number().positive("Cost must be positive").max(1000000, "Cost must be less than 1000000"),
  company_id: z.coerce.number().positive("Company is required"),
});

export const chargingPointSchema = z.object({
  company_id: z.coerce.number().positive("Company is required"),
  location: z.string().trim().min(1, "Location is required").max(255, "Location must be less than 255 characters"),
  num_of_points: z.coerce.number().int().positive("Number of points must be positive").max(1000, "Number of points must be less than 1000"),
  availability: z.enum(["Available", "Occupied", "Maintenance"], {
    errorMap: () => ({ message: "Please select a valid availability status" })
  }),
  functionality: z.string().trim().min(1, "Functionality is required").max(100, "Functionality must be less than 100 characters"),
  max_voltage: z.coerce.number().positive("Max voltage must be positive").max(10000, "Max voltage must be less than 10000"),
});

export const receiptSchema = z.object({
  receipt_number: z.string().trim().min(1, "Receipt number is required").max(50, "Receipt number must be less than 50 characters"),
  company_id: z.coerce.number().positive("Company is required"),
  amount: z.coerce.number().positive("Amount must be positive").max(1000000, "Amount must be less than 1000000"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type EVInfoFormData = z.infer<typeof evInfoSchema>;
export type ChargingPointFormData = z.infer<typeof chargingPointSchema>;
export type ReceiptFormData = z.infer<typeof receiptSchema>;
