const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  // Optional: show a loader while checking login status

  return <>{children}</>;
};

export default ProtectedRoutes;
