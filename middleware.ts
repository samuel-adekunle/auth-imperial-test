import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "lib/session";

export const config = {
  matcher: "/member",
};

async function memberOnlyMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  const { user } = session;

  console.log("from middleware", { user });

  if (!user?.isICACSMember) {
    return new NextResponse(null, { status: 403 }); // unauthorized to see member only pages
  }

  return res;
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/member')) {
    return memberOnlyMiddleware(req)
  }
};