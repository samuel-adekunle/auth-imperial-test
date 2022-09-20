import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import axios from 'axios'
import { sessionOptions, User } from 'lib/session'

// authICACS uses the Imperial College Student Union endpoint authenticate ICACS members.
// `username` should be the student's shortcode, e.g. ab123.
async function authICACSMember(username: string, password: string) {
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

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const { username, password } = req.body
  let user: User = { username: null, isICStudent: false, isICACSMember: false }
  if (!username || !password) {
    return res.status(400).json(user)
  }
  const authRes = await authICACSMember(username, password)

  if (authRes === null) {
    return res.status(400).json(user)
  }

  user.username = username
  user.isICStudent = true
  if (authRes) {
    user.isICACSMember = true
  }
  req.session.user = user
  await req.session.save()
  return res.status(200).json(user)
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)