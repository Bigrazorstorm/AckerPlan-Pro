'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddOperationSchema = z.object({
  type: z.string().min(1, { message: 'Type is required' }),
  field: z.string().min(1, { message: 'Field is required' }),
  machineId: z.string().min(1, { message: 'Machine is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  laborHours: z.coerce.number().min(0, { message: 'Labor hours must be a positive number' }),
  status: z.enum(['Completed', 'In Progress']),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addOperation(prevState: any, formData: FormData) {
  const validatedFields = AddOperationSchema.safeParse({
    type: formData.get('type'),
    field: formData.get('field'),
    machineId: formData.get('machineId'),
    date: formData.get('date'),
    laborHours: formData.get('laborHours'),
    status: formData.get('status'),
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
    const { tenantId, companyId, ...operationData } = validatedFields.data;
    await dataService.addOperation(tenantId, companyId, operationData)
    revalidatePath('/operations')
    return { message: 'Operation added successfully.' }
  } catch (e) {
    return {
      message: 'Failed to add operation.',
      errors: { _form: ['Failed to add operation.'] },
    }
  }
}
