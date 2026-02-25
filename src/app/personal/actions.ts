
'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/services/types'
 
const AddUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.string().min(1, { message: 'Role is required' }),
  pesticideLicenseNumber: z.string().optional().or(z.literal('')),
  pesticideLicenseExpiry: z.string().optional().or(z.literal('')),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})

const UpdateUserSchema = AddUserSchema.extend({
  id: z.string().min(1, { message: 'User ID is required' }),
});
 
export async function addUser(prevState: any, formData: FormData) {
  const validatedFields = AddUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    pesticideLicenseNumber: formData.get('pesticideLicenseNumber'),
    pesticideLicenseExpiry: formData.get('pesticideLicenseExpiry'),
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
    const { tenantId, companyId, ...userData } = validatedFields.data;
    await dataService.addUser(tenantId, companyId, {
      name: userData.name,
      email: userData.email,
      role: userData.role as Role,
      pesticideLicenseNumber: userData.pesticideLicenseNumber || undefined,
      pesticideLicenseExpiry: userData.pesticideLicenseExpiry || undefined,
    })
    revalidatePath('/personal')
    return { message: 'User added successfully.', errors: {} }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `Failed to add user: ${errorMessage}`,
      errors: {},
    }
  }
}

export async function updateUser(prevState: any, formData: FormData) {
  const validatedFields = UpdateUserSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    pesticideLicenseNumber: formData.get('pesticideLicenseNumber'),
    pesticideLicenseExpiry: formData.get('pesticideLicenseExpiry'),
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
    const { tenantId, companyId, id, ...userData } = validatedFields.data;
    await dataService.updateUser(tenantId, companyId, id, {
      name: userData.name,
      email: userData.email,
      role: userData.role as Role,
      pesticideLicenseNumber: userData.pesticideLicenseNumber || undefined,
      pesticideLicenseExpiry: userData.pesticideLicenseExpiry || undefined,
    })
    revalidatePath('/personal')
    return { message: 'User updated successfully.', errors: {} }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `Failed to update user: ${errorMessage}`,
      errors: {},
    }
  }
}

export async function deleteUser(userId: string, tenantId: string, companyId: string) {
  if (!userId || !tenantId || !companyId) {
    return { message: 'Failed to remove user: Missing required IDs.' };
  }
  try {
    await dataService.deleteUser(tenantId, companyId, userId);
    revalidatePath('/personal');
    return { message: 'User removed successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Failed to remove user: ${errorMessage}` };
  }
}
