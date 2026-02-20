'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@/services/types'
 
const AddUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.string().min(1, { message: 'Role is required' }),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addUser(prevState: any, formData: FormData) {
  const validatedFields = AddUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
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
    })
    revalidatePath('/settings')
    return { message: 'User added successfully.', errors: {} }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return {
      message: `Failed to add user: ${errorMessage}`,
      errors: {},
    }
  }
}
