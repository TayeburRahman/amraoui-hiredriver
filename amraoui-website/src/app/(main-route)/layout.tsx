import { Navbar } from "@/components/common/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-480 mx-auto">
      <Navbar />
      {children}
    </div>
  );
}
