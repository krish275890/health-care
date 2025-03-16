import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LoginButton } from "@/components/login-button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Healthcare Clock</h1>
          <LoginButton />
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <section className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Simplified Time Tracking for Healthcare Workers</h2>
            <p className="text-xl text-muted-foreground mb-8">
              An easy-to-use platform for healthcare organizations to manage staff clock-ins and track working hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </section>

          <section id="features" className="py-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Geolocation Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Clock in and out within designated perimeters set by managers to ensure staff are on-site.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Managers can view who's currently clocked in, track hours, and analyze attendance patterns.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Access the platform from any device with our responsive design and progressive web app capabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>For Managers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• Set location perimeters for clock-in zones</p>
                  <p>• Monitor staff attendance in real-time</p>
                  <p>• Access detailed reports and analytics</p>
                  <p>• Track total hours worked by each staff member</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/login">Manager Login</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Care Workers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• Easily clock in and out with a single tap</p>
                  <p>• Add notes to your clock events</p>
                  <p>• View your work history and hours</p>
                  <p>• Receive notifications when entering work zones</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/login">Staff Login</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Healthcare Clock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

