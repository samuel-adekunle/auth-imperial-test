import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// authICACS uses the Imperial College Student Union endpoint authenticate ICACS members.
// `username` should be the student's shortcode, e.g. sja119.
async function authICACS(username: string, password: string): Promise<boolean | null> {
  try {
    const res = await axios.post("https://eactivities.union.ic.ac.uk/user/login", { username, password }, {
      headers: {
        "Accept": "*/*"
      }
    })
    const data: string = res.data
    return data.match("Member - CTN Afro-Caribbean") !== null
  } catch (error) {
    return null
  }
}

type Data = {
  isStudent: boolean
  isMember: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      isStudent: false,
      isMember: false
    })
  }
  const authRes = await authICACS(username, password)

  switch (authRes) {
    case null:
      res.status(400).json({
        isStudent: false,
        isMember: false
      })
      break
    case false:
      res.status(401).json({
        isStudent: true,
        isMember: false
      })
      break
    case true:
      res.status(200).json({
        isStudent: true,
        isMember: true
      })
      break
  }
}
