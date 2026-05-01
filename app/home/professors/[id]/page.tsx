import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { RatingForm } from '@/components/rating-form'
import { submitRating } from './actions'
import type { Rating } from '@/lib/types'

function StarDisplay({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const iconClass = size === 'lg' ? 'size-5' : 'size-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${iconClass} ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function ProfessorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const professorId = parseInt(id, 10)
  if (isNaN(professorId)) notFound()

  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.getClaims()
  if (error || !authData?.claims) redirect('/auth/login')

  const userId = authData.claims.sub as string

  const { data: professor } = await supabase
    .from('professors')
    .select('*')
    .eq('id', professorId)
    .single()

  if (!professor) notFound()

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*')
    .eq('professor_id', professorId)
    .order('created_at', { ascending: false }) as { data: Rating[] | null }

  const ratingsList = ratings ?? []
  const avgRating =
    ratingsList.length
      ? ratingsList.reduce((sum, r) => sum + r.rating, 0) / ratingsList.length
      : null

  const userRating = ratingsList.find((r) => r.user_id === userId) ?? null

  const boundAction = submitRating.bind(null, professorId)

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <Link
        href="/home"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="size-4" />
        All professors
      </Link>

      {/* Professor header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {professor.first_name} {professor.last_name}
        </h2>
        <p className="text-sm text-muted-foreground">{professor.department}</p>
        <div className="flex items-center gap-2 mt-1">
          {avgRating !== null ? (
            <>
              <StarDisplay value={avgRating} size="lg" />
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({ratingsList.length} {ratingsList.length === 1 ? 'rating' : 'ratings'})
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No ratings yet — be the first!</span>
          )}
        </div>
      </div>

      {/* Rating form */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {userRating ? 'Update your rating' : 'Rate this professor'}
          </CardTitle>
          {userRating && (
            <CardDescription>You rated {userRating.rating}/5 — you can update it below.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RatingForm action={boundAction} existingRating={userRating} />
        </CardContent>
      </Card>

      {/* Ratings list */}
      {ratingsList.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Reviews ({ratingsList.length})
          </h3>
          {ratingsList.map((rating) => (
            <Card key={rating.id} size="sm">
              <CardContent className="pt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarDisplay value={rating.rating} />
                    <span className="text-xs font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      {rating.course_section}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(rating.created_at)}</span>
                </div>
                {rating.comment && (
                  <p className="text-sm text-foreground leading-relaxed">{rating.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
