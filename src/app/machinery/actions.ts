'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddMachineSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
})
 
export async function addMachine(prevState: any, formData: FormData) {
  const validatedFields = AddMachineSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    model: formData.get('model'),
  })
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    }
  }
  
  try {
    const tenantId = 'tenant-123' // Dummy value, replace with actual tenant from session
    const companyId = 'company-456' // Dummy value, replace with actual company from session
    await dataService.addMachinery(tenantId, companyId, validatedFields.data)
    revalidatePath('/machinery')
    return { message: 'Machine added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add machine.',
      errors: {},
    }
  }
}
