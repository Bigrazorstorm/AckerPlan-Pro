'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddObservationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  field: z.string().min(1, { message: 'Field is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addObservation(prevState: any, formData: FormData) {
  const validatedFields = AddObservationSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    field: formData.get('field'),
    date: formData.get('date'),
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
    const { tenantId, companyId, ...observationData } = validatedFields.data;
    await dataService.addObservation(tenantId, companyId, observationData)
    revalidatePath('/observations')
    return { message: 'Observation added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add observation.',
      errors: {},
    }
  }
}
