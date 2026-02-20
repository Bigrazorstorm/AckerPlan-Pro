'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddMachineSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  standardFuelConsumption: z.coerce.number().min(0, { message: 'Consumption must be a positive number' }),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addMachine(prevState: any, formData: FormData) {
  const validatedFields = AddMachineSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    model: formData.get('model'),
    standardFuelConsumption: formData.get('standardFuelConsumption'),
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
    const { tenantId, companyId, ...machineData } = validatedFields.data;
    await dataService.addMachinery(tenantId, companyId, machineData)
    revalidatePath('/machinery')
    return { message: 'Machine added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add machine.',
      errors: {},
    }
  }
}
