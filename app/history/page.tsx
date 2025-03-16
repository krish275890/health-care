"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft, Clock, LogOut, MapPin } from "lucide-react"

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

export default function HistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [clockEvents, setClockEvents] = useState<ClockEvent[]>([])
  const [shifts, setShifts] = useState<{ in: ClockEvent; out?: ClockEvent }[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Get clock events from localStorage
    const storedEvents = localStorage.getItem("clockEvents")
    if (storedEvents) {
      const events = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }))
      setClockEvents(events)

      // Group events into shifts
      const shiftsArray: { in: ClockEvent; out?: ClockEvent }[] = []
      let currentShift: { in: ClockEvent; out?: ClockEvent } | null = null

      events.forEach((event: ClockEvent) => {
        if (event.type === "in") {
          if (currentShift) {
            shiftsArray.push(currentShift)
          }
          currentShift = { in: event }
        } else if (event.type === "out" && currentShift) {
          currentShift.out = event
          shiftsArray.push(currentShift)
          currentShift = null
        }
      })

      // Add the last shift if it's still open
      if (currentShift) {
        shiftsArray.push(currentShift)
      }

      setShifts(shiftsArray.reverse()) // Most recent first
    }
  }, [])

  const calculateDuration = (inTime: Date, outTime?: Date): string => {
    const endTime = outTime || new Date()
    const durationMs = endTime.getTime() - inTime.getTime()

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Healthcare Clock</h1>
          <Button variant="outline" onClick={() => router.push("/clock")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clock
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift History</CardTitle>
              <CardDescription>View your recent clock in and out history</CardDescription>
            </CardHeader>
            <CardContent>
              {shifts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No shift history found. Clock in to start recording your shifts.
                </div>
              ) : (
                <div className="space-y-6">
                  {shifts.map((shift, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{shift.in.timestamp.toLocaleDateString()} Shift</h3>
                          <p className="text-sm text-muted-foreground">
                            Duration: {calculateDuration(shift.in.timestamp, shift.out?.timestamp)}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">{shift.out ? "Completed" : "In Progress"}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">Clock In</span>
                          </div>
                          <div className="text-sm">
                            <p>Time: {shift.in.timestamp.toLocaleTimeString()}</p>
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Location: {shift.in.location.latitude.toFixed(6)},{" "}
                              {shift.in.location.longitude.toFixed(6)}
                            </p>
                            {shift.in.note && <p className="mt-2 italic">"{shift.in.note}"</p>}
                          </div>
                        </div>

                        {shift.out && (
                          <div className="space-y-2 p-3 bg-muted rounded-md">
                            <div className="flex items-center gap-2">
                              <LogOut className="h-4 w-4 text-destructive" />
                              <span className="font-medium">Clock Out</span>
                            </div>
                            <div className="text-sm">
                              <p>Time: {shift.out.timestamp.toLocaleTimeString()}</p>
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Location: {shift.out.location.latitude.toFixed(6)},{" "}
                                {shift.out.location.longitude.toFixed(6)}
                              </p>
                              {shift.out.note && <p className="mt-2 italic">"{shift.out.note}"</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

