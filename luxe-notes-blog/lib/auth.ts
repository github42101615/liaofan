import type { NextRequest } from "next/server";

export function isAdminAuthorized(request: NextRequest) {
  const providedSecret = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_SECRET;

  return Boolean(expectedSecret && providedSecret && providedSecret === expectedSecret);
}
