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
  n: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'N must be a positive number' }).max(100).optional()
  ),
  p: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'P must be a positive number' }).max(100).optional()
  ),
  k: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'K must be a positive number' }).max(100).optional()
  ),
  registrationNumber: z.string().optional().or(z.literal('')),
  waitingPeriodDays: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive({ message: 'Waiting period must be a positive number' }).optional()
  ),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})

const UpdateWarehouseItemSchema = z.object({
  id: z.string().min(1, { message: 'Item ID is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  itemType: z.enum(['Seed', 'Fertilizer', 'Pesticide', 'Other']),
  unit: z.string().min(1, { message: 'Unit is required' }),
  costPerUnit: z.coerce.number().min(0, { message: 'Cost must be a positive number' }),
  n: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'N must be a positive number' }).max(100).optional()
  ),
  p: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'P must be a positive number' }).max(100).optional()
  ),
  k: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(0, { message: 'K must be a positive number' }).max(100).optional()
  ),
  registrationNumber: z.string().optional().or(z.literal('')),
  waitingPeriodDays: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().positive({ message: 'Waiting period must be a positive number' }).optional()
  ),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
});
 
export async function addWarehouseItem(prevState: any, formData: FormData) {
  const validatedFields = AddWarehouseItemSchema.safeParse({
    name: formData.get('name'),
    itemType: formData.get('itemType'),
    quantity: formData.get('quantity'),
    unit: formData.get('unit'),
    costPerUnit: formData.get('costPerUnit'),
    n: formData.get('n'),
    p: formData.get('p'),
    k: formData.get('k'),
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

export async function updateWarehouseItem(prevState: any, formData: FormData) {
    const validatedFields = UpdateWarehouseItemSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        itemType: formData.get('itemType'),
        unit: formData.get('unit'),
        costPerUnit: formData.get('costPerUnit'),
        n: formData.get('n'),
        p: formData.get('p'),
        k: formData.get('k'),
        registrationNumber: formData.get('registrationNumber'),
        waitingPeriodDays: formData.get('waitingPeriodDays'),
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
        const { tenantId, companyId, id, ...itemData } = validatedFields.data;
        await dataService.updateWarehouseItem(tenantId, companyId, id, {
            ...itemData,
            itemType: itemData.itemType as WarehouseItemType,
            registrationNumber: itemData.registrationNumber || undefined,
        });
        revalidatePath('/lager');
        return { message: 'Warehouse item updated successfully.', errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return {
            message: `Failed to update item: ${errorMessage}`,
            errors: {},
        }
    }
}

export async function deleteWarehouseItem(itemId: string, tenantId: string, companyId: string) {
  if (!itemId || !tenantId || !companyId) {
    return { message: 'Failed to delete item: Missing required IDs.' };
  }
  try {
    await dataService.deleteWarehouseItem(tenantId, companyId, itemId);
    revalidatePath('/lager');
    return { message: 'Warehouse item deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Failed to delete item: ${errorMessage}` };
  }
}
