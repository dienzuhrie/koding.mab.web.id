import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex flex-wrap min-h-screen w-full bg-[#f5fbf4]">
      <Sidebar role={session.user.role} />
      <main className="flex-[999_1_560px] min-w-0 p-8 box-border">{children}</main>
    </div>
  );
}
