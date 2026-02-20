'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddRepairSchema = z.object({
  description: z.string().min(3, { message: 'Description must be at least 3 characters long' }),
  cost: z.coerce.number().min(0, { message: 'Cost must be a positive number' }),
  downtimeHours: z.coerce.number().min(0, { message: 'Downtime must be a positive number' }),
  date: z.string().min(1, { message: 'Date is required' }),
  machineId: z.string().min(1, { message: 'Machine ID is required' }),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addRepairEvent(prevState: any, formData: FormData) {
  const validatedFields = AddRepairSchema.safeParse({
    description: formData.get('description'),
    cost: formData.get('cost'),
    downtimeHours: formData.get('downtimeHours'),
    date: formData.get('date'),
    machineId: formData.get('machineId'),
    tenantId: formData.get('tenantId'),
    companyId: formData.get('companyId'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    }
  }
  
  try {
    const { tenantId, companyId, ...eventData } = validatedFields.data;
    await dataService.addRepairEvent(tenantId, companyId, eventData);
    revalidatePath(`/machinery/${eventData.machineId}`)
    return { message: 'Repair event added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add repair event.',
      errors: {},
    }
  }
}
