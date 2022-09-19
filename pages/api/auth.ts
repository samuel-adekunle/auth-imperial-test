import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// authICACS uses the Imperial College Student Union endpoint authenticate ICACS members.
// `username` should be the student's shortcode, e.g. ab123.
async function authICACSMember(username: string, password: string): Promise<boolean | null> {
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
  isICStudent: boolean
  isICACSMember: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      isICStudent: false,
      isICACSMember: false
    })
  }
  const authRes = await authICACSMember(username, password)

  switch (authRes) {
    case null:
      res.status(400).json({
        isICStudent: false,
        isICACSMember: false
      })
      break
    case false:
      res.status(401).json({
        isICStudent: true,
        isICACSMember: false
      })
      break
    case true:
      res.status(200).json({
        isICStudent: true,
        isICACSMember: true
      })
      break
  }
}
