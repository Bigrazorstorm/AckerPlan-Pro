'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { WarehouseItemType } from '@/services/types'
 
const AddWarehouseItemSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  itemType: z.enum(['Seed', 'Fertilizer', 'Pesticide', 'Other']),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be a positive number' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  costPerUnit: z.coerce.number().min(0, { message: 'Cost must be a positive number' }),
  registrationNumber: z.string().optional().or(z.literal('')),
  waitingPeriodDays: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive({ message: 'Waiting period must be a positive number' }).optional()
  ),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addWarehouseItem(prevState: any, formData: FormData) {
  const validatedFields = AddWarehouseItemSchema.safeParse({
    name: formData.get('name'),
    itemType: formData.get('itemType'),
    quantity: formData.get('quantity'),
    unit: formData.get('unit'),
    costPerUnit: formData.get('costPerUnit'),
    registrationNumber: formData.get('registrationNumber'),
    waitingPeriodDays: formData.get('waitingPeriodDays'),
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
    const { tenantId, companyId, ...itemData } = validatedFields.data;
    await dataService.addWarehouseItem(tenantId, companyId, {
      ...itemData,
      itemType: itemData.itemType as WarehouseItemType,
      registrationNumber: itemData.registrationNumber || undefined,
    })
    revalidatePath('/lager')
    return { message: 'Warehouse item added successfully.', errors: {} }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `Failed to add item: ${errorMessage}`,
      errors: {},
    }
  }
}
