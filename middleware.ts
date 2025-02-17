import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Public routes
  if (req.nextUrl.pathname.startsWith("/signup")) {
    return NextResponse.next();
  }
});
