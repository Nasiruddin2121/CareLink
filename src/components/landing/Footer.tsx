export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 py-10">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 text-center text-sm text-gray-400 sm:px-6 lg:px-8">
        <p className="font-medium">
          © {new Date().getFullYear()} CareLink Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
