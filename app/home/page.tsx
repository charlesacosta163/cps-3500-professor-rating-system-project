import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AddProfessorForm } from '@/components/add-professor-form'
import { createProfessor } from './actions'
import type { ProfessorWithRatings } from '@/lib/types'

function avgRating(ratings: { rating: number }[]) {
  if (!ratings.length) return null
  return (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
}

function StarDisplay({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-muted-foreground">No ratings yet</span>
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-3.5 ${n <= Math.round(Number(value)) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{value}</span>
    </div>
  )
}

export default async function ProfessorsPage() {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.getClaims()
  if (error || !authData?.claims) redirect('/auth/login')

  const { data: professors } = await supabase
    .from('professors')
    .select('*, ratings(rating)')
    .order('last_name') as { data: ProfessorWithRatings[] | null }

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Professors</h2>
          <p className="text-sm text-muted-foreground">Select a professor to view ratings or leave a review.</p>
        </div>
        <AddProfessorForm action={createProfessor} />
      </div>

      {!professors?.length ? (
        <p className="text-sm text-muted-foreground">No professors found.</p>
      ) : (
        <div className="grid gap-3">
          {professors.map((professor) => {
            const avg = avgRating(professor.ratings)
            const count = professor.ratings.length
            return (
              <Link key={professor.id} href={`/home/professors/${professor.id}`}>
                <Card className="hover:ring-foreground/20 transition-all cursor-pointer">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base">
                      {professor.first_name} {professor.last_name}
                    </CardTitle>
                    <CardDescription>{professor.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <StarDisplay value={avg ? Number(avg) : null} />
                      {count > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {count} {count === 1 ? 'rating' : 'ratings'}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
