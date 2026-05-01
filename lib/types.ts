export type Professor = {
  id: number
  created_at: string
  first_name: string
  last_name: string
  department: string
}

export type ProfessorWithRatings = Professor & {
  ratings: { rating: number }[]
}

export type Rating = {
  id: number
  created_at: string
  professor_id: number
  rating: number
  comment: string | null
  user_id: string
  course_section: string
}
