import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="font-bold text-xl">PropertyPro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Properties with Ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your property management with our comprehensive platform. Track rentals, maintenance, and more all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/dashboard">
                  <Button>Get Started</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 items-start">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Property Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily manage multiple properties, units, and tenants from a single dashboard.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Maintenance Tracking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keep track of maintenance requests and schedule repairs efficiently.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Financial Reports</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate detailed financial reports and track your rental income.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 PropertyPro. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}