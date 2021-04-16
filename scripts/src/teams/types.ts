export type Team = {
  id: number
  name: string
  country: string
  founded: number
  national: boolean
  logo: string
}

export type Venue = {
  id: number
  name: string
  address: string
  city: string
  capacity: number
  surface: string
  image: string
}

export type FootballApiTeam = {
  team: Team
  venue: Venue
}
