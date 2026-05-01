'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createProfessor(formData: FormData) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) throw new Error('You must be logged in.')

  const firstName = (formData.get('first_name') as string)?.trim()
  const lastName = (formData.get('last_name') as string)?.trim()
  const department = (formData.get('department') as string)?.trim()

  if (!firstName || !lastName || !department) {
    throw new Error('All fields are required.')
  }

  const { error } = await supabase.from('professors').insert({
    first_name: firstName,
    last_name: lastName,
    department,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/home')
}
