import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex w-full min-h-screen bg-[#f5fbf4]">
      <Sidebar role={session.user.role} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
          role={session.user.role}
        />
        <main className="flex-1 p-8 box-border">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
