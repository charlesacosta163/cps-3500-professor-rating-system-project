'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function submitRating(professorId: number, formData: FormData) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) throw new Error('You must be logged in to submit a rating.')

  const ratingRaw = formData.get('rating')
  const comment = (formData.get('comment') as string)?.trim() || null
  const courseSection = (formData.get('course_section') as string)?.trim()

  const rating = parseInt(ratingRaw as string, 10)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Please select a rating between 1 and 5.')
  }

  if (!courseSection) {
    throw new Error('Course section is required.')
  }

  const userId = authData.claims.sub as string

  // Check if the user already has a rating for this professor
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('professor_id', professorId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    // Update existing rating
    const { error } = await supabase
      .from('ratings')
      .update({ rating, comment, course_section: courseSection })
      .eq('id', existing.id)

    if (error) throw new Error(error.message)
  } else {
    // Insert new rating
    const { error } = await supabase.from('ratings').insert({
      professor_id: professorId,
      rating,
      comment,
      course_section: courseSection,
      user_id: userId,
    })

    if (error) throw new Error(error.message)
  }

  revalidatePath(`/home/professors/${professorId}`)
  revalidatePath('/home')
}
