import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions, User } from "lib/session";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy()
  res.status(200).json({
    username: null,
    isICStudent: false,
    isICACSMember: false
  })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)