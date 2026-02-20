'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
 
const AddOperationSchema = z.object({
  type: z.string().min(1, { message: 'Type is required' }),
  fields: z.array(z.string()).min(1, { message: 'At least one field is required' }),
  machineId: z.string().min(1, { message: 'Machine is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  laborHours: z.coerce.number().min(0, { message: 'Labor hours must be a positive number' }),
  status: z.enum(['Completed', 'In Progress']),
  yieldAmount: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive({ message: 'Yield must be a positive number' }).optional()
  ),
  revenue: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive({ message: 'Revenue must be a positive number' }).optional()
  ),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})

const UpdateOperationSchema = AddOperationSchema.extend({
  id: z.string().min(1, { message: 'Operation ID is required' }),
  fields: z.array(z.string()).optional(), // Field is not updatable this way
})
 
export async function addOperation(prevState: any, formData: FormData) {
  const validatedFields = AddOperationSchema.safeParse({
    type: formData.get('type'),
    fields: formData.getAll('fields'),
    machineId: formData.get('machineId'),
    date: formData.get('date'),
    laborHours: formData.get('laborHours'),
    status: formData.get('status'),
    yieldAmount: formData.get('yieldAmount'),
    revenue: formData.get('revenue'),
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
    return { message: 'Operation added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add operation.',
      errors: { _form: ['Failed to add operation.'] },
    }
  }
}

export async function updateOperation(prevState: any, formData: FormData) {
    const validatedFields = UpdateOperationSchema.safeParse({
        id: formData.get('id'),
        type: formData.get('type'),
        machineId: formData.get('machineId'),
        date: formData.get('date'),
        laborHours: formData.get('laborHours'),
        status: formData.get('status'),
        yieldAmount: formData.get('yieldAmount'),
        revenue: formData.get('revenue'),
        tenantId: formData.get('tenantId'),
        companyId: formData.get('companyId'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check the fields.',
        }
    }

    try {
        const { tenantId, companyId, id, ...operationData } = validatedFields.data;
        // The 'fields' array is not passed to updateOperation, as we're editing a single operation record.
        const { fields, ...updateData } = operationData;
        await dataService.updateOperation(tenantId, companyId, id, updateData);
        revalidatePath('/operations');
        return { message: 'Operation updated successfully.', errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            message: `Failed to update operation: ${errorMessage}`,
            errors: {},
        }
    }
}

export async function deleteOperation(operationId: string, tenantId: string, companyId: string) {
  if (!operationId || !tenantId || !companyId) {
    return { message: 'Failed to delete operation: Missing required IDs.' };
  }
  try {
    await dataService.deleteOperation(tenantId, companyId, operationId);
    revalidatePath('/operations');
    return { message: 'Operation deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Failed to delete operation: ${errorMessage}` };
  }
}
