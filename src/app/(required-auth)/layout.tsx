import { AuthLoader } from "@/components/shared/auth-loader";
import { Loader } from "@/components/shared/loader";
import { Suspense } from "react";

export default function RequiredAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <AuthLoader authLoading={<Loader />}>{children}</AuthLoader>
    </Suspense>
  );
}
