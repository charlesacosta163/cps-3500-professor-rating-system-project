'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AddProfessorFormProps {
  action: (formData: FormData) => Promise<void>
}

export function AddProfessorForm({ action }: AddProfessorFormProps) {
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    startTransition(async () => {
      try {
        await action(formData)
        form.reset()
        setOpen(false)
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <div>
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          Add professor
        </Button>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">New professor</CardTitle>
              <button
                type="button"
                onClick={() => { setOpen(false); setErrorMsg(null) }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" name="first_name" placeholder="Jane" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" name="last_name" placeholder="Smith" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="Computer Science" required />
              </div>

              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add professor'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setOpen(false); setErrorMsg(null) }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
