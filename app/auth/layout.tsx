// app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Nema poziva u Supabase, nema cookies, samo wrappa children.
  return <>{children}</>;
}
