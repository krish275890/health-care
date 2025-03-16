"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, Clock, LogOut } from "lucide-react"

type ClockEvent = {
  id: string
  type: "in" | "out"
  timestamp: Date
  location: {
    latitude: number
    longitude: number
  }
  note?: string
}

type LocationPerimeter = {
  center: {
    latitude: number
    longitude: number
  }
  radius: number // in kilometers
}

export default function ClockPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [note, setNote] = useState("")
  const [clockEvents, setClockEvents] = useState<ClockEvent[]>([])
  const [isWithinPerimeter, setIsWithinPerimeter] = useState(false)

  // Mock perimeter (would come from API in real app)
  const [perimeter] = useState<LocationPerimeter>({
    center: {
      latitude: 37.7749, // Example: San Francisco
      longitude: -122.4194,
    },
    radius: 2, // 2 kilometers
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation(position.coords)
          setLocationError(null)

          // Check if user is within perimeter
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            perimeter.center.latitude,
            perimeter.center.longitude,
          )

          setIsWithinPerimeter(distance <= perimeter.radius)
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`)
          setIsWithinPerimeter(false)
        },
        { enableHighAccuracy: true },
      )

      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      setLocationError("Geolocation is not supported by this browser.")
    }
  }, [perimeter])

  useEffect(() => {
    // Check if user is already clocked in (from localStorage)
    const storedEvents = localStorage.getItem("clockEvents")
    if (storedEvents) {
      const events = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }))
      setClockEvents(events)

      // Check if last event was clock in
      const lastEvent = events[events.length - 1]
      if (lastEvent && lastEvent.type === "in") {
        setIsClockedIn(true)
      }
    }
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Haversine formula to calculate distance between two points
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const handleClockIn = () => {
    if (!currentLocation) {
      toast({
        title: "Location Error",
        description: "Unable to get your current location.",
        variant: "destructive",
      })
      return
    }

    if (!isWithinPerimeter) {
      toast({
        title: "Outside Work Area",
        description: "You must be within the designated work area to clock in.",
        variant: "destructive",
      })
      return
    }

    const newEvent: ClockEvent = {
      id: Date.now().toString(),
      type: "in",
      timestamp: new Date(),
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      note: note || undefined,
    }

    const updatedEvents = [...clockEvents, newEvent]
    setClockEvents(updatedEvents)
    localStorage.setItem("clockEvents", JSON.stringify(updatedEvents))

    setIsClockedIn(true)
    setNote("")

    toast({
      title: "Clocked In",
      description: `Successfully clocked in at ${new Date().toLocaleTimeString()}`,
    })
  }

  const handleClockOut = () => {
    if (!currentLocation) {
      toast({
        title: "Location Error",
        description: "Unable to get your current location.",
        variant: "destructive",
      })
      return
    }

    const newEvent: ClockEvent = {
      id: Date.now().toString(),
      type: "out",
      timestamp: new Date(),
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      note: note || undefined,
    }

    const updatedEvents = [...clockEvents, newEvent]
    setClockEvents(updatedEvents)
    localStorage.setItem("clockEvents", JSON.stringify(updatedEvents))

    setIsClockedIn(false)
    setNote("")

    toast({
      title: "Clocked Out",
      description: `Successfully clocked out at ${new Date().toLocaleTimeString()}`,
    })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Healthcare Clock</h1>
          <Button variant="outline" onClick={() => router.push("/history")}>
            View History
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clock {isClockedIn ? "Out" : "In"}</CardTitle>
              <CardDescription>
                {isClockedIn
                  ? "You are currently clocked in. Clock out when your shift ends."
                  : "Clock in to start your shift."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {locationError ? (
                  <span className="text-destructive">{locationError}</span>
                ) : currentLocation ? (
                  <span>
                    Location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </span>
                ) : (
                  <span>Getting your location...</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Current time: {new Date().toLocaleTimeString()}</span>
              </div>

              {!isWithinPerimeter && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  You are outside the designated work area. You must be within {perimeter.radius}km of the work location
                  to clock in.
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="note" className="text-sm font-medium">
                  Note (optional)
                </label>
                <Textarea
                  id="note"
                  placeholder="Add a note about your shift..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              {isClockedIn ? (
                <Button className="w-full" onClick={handleClockOut} variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Clock Out
                </Button>
              ) : (
                <Button className="w-full" onClick={handleClockIn} disabled={!isWithinPerimeter}>
                  <Clock className="mr-2 h-4 w-4" />
                  Clock In
                </Button>
              )}
            </CardFooter>
          </Card>

          {isClockedIn && (
            <Card>
              <CardHeader>
                <CardTitle>Current Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clock In Time:</span>
                    <span className="font-medium">
                      {clockEvents.find((e) => e.type === "in")?.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {formatDuration(
                        new Date().getTime() - (clockEvents.find((e) => e.type === "in")?.timestamp.getTime() || 0),
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const displayHours = hours
  const displayMinutes = minutes % 60
  const displaySeconds = seconds % 60

  return `${displayHours}h ${displayMinutes}m ${displaySeconds}s`
}

