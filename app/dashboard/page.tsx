import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">User Profile</h2>

        <div className="space-y-3">
          <div>
            <span className="font-medium">Name: </span>
            <span>{session.user.name}</span>
          </div>

          <div>
            <span className="font-medium">Email: </span>
            <span>{session.user.email}</span>
          </div>

          <div>
            <span className="font-medium">User ID: </span>
            <span>{session.user.id}</span>
          </div>
        </div>
      </div>

      <pre className="mt-8 p-4 bg-gray-100 rounded-lg overflow-auto">
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </div>
  );
}
