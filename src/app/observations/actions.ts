'use server'
 
import dataService from '@/services'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ObservationType } from '@/services/types'
 
const AddObservationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  field: z.string().min(1, { message: 'Field is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  photoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  latitude: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().optional()
  ),
  longitude: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().optional()
  ),
  observationType: z.enum(['Routine', 'Pest', 'NutrientDeficiency', 'Damage', 'Other']),
  bbchStage: z.coerce.number().min(0, {message: 'BBCH must be a positive number'}).max(99, { message: 'BBCH must be between 0 and 99'}),
  intensity: z.coerce.number().min(1).max(5),
  tenantId: z.string().min(1, { message: 'Tenant ID is required' }),
  companyId: z.string().min(1, { message: 'Company ID is required' }),
})
 
export async function addObservation(prevState: any, formData: FormData) {
  const validatedFields = AddObservationSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    field: formData.get('field'),
    date: formData.get('date'),
    photoUrl: formData.get('photoUrl'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    observationType: formData.get('observationType'),
    bbchStage: formData.get('bbchStage'),
    intensity: formData.get('intensity'),
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
    await dataService.addObservation(tenantId, companyId, {
        ...observationData,
        photoUrl: observationData.photoUrl || undefined,
        observationType: observationData.observationType as ObservationType,
    })
    revalidatePath('/observations')
    return { message: 'Observation added successfully.', errors: {} }
  } catch (e) {
    return {
      message: 'Failed to add observation.',
      errors: {},
    }
  }
}

export async function deleteObservation(observationId: string, tenantId: string, companyId: string) {
  if (!observationId || !tenantId || !companyId) {
    return { message: 'Failed to delete observation: Missing required IDs.' };
  }
  try {
    await dataService.deleteObservation(tenantId, companyId, observationId);
    revalidatePath('/observations');
    return { message: 'Observation deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { message: `Failed to delete observation: ${errorMessage}` };
  }
}
