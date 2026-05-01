'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Rating } from '@/lib/types'

interface RatingFormProps {
  action: (formData: FormData) => Promise<void>
  existingRating: Rating | null
}

export function RatingForm({ action, existingRating }: RatingFormProps) {
  const [selectedRating, setSelectedRating] = useState<number>(existingRating?.rating ?? 0)
  const [hovered, setHovered] = useState<number>(0)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccess(false)

    if (selectedRating === 0) {
      setErrorMsg('Please select a star rating.')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('rating', String(selectedRating))

    startTransition(async () => {
      try {
        await action(formData)
        setSuccess(true)
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Star picker */}
      <div className="flex flex-col gap-1.5">
        <Label>Rating</Label>
        <div
          className="flex gap-1"
          onMouseLeave={() => setHovered(0)}
          role="group"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelectedRating(n)}
              onMouseEnter={() => setHovered(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                className={`size-6 transition-colors ${
                  n <= (hovered || selectedRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
        {selectedRating > 0 && (
          <p className="text-xs text-muted-foreground">
            {['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][selectedRating]}
          </p>
        )}
      </div>

      {/* Course section */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="course_section">Course section</Label>
        <Input
          id="course_section"
          name="course_section"
          placeholder="e.g. CS 101 — Section 3"
          required
          defaultValue={existingRating?.course_section ?? ''}
        />
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="comment">Comment <span className="text-muted-foreground font-normal">(optional)</span></Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Share your experience with this professor..."
          defaultValue={existingRating?.comment ?? ''}
        />
      </div>

      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      {success && (
        <p className="text-sm text-green-600">
          {existingRating ? 'Rating updated!' : 'Rating submitted!'}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Saving...' : existingRating ? 'Update rating' : 'Submit rating'}
      </Button>
    </form>
  )
}
