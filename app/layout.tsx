import "./globals.css";

export const metadata = {
  title: "[project Project]",
  description: "[project Project] is a collaborative and interactive project management application that was ideated in two hours, planned in a day, then developed in 11 days by four full-stack Javascript bootcamp students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
