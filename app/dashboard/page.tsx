"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Clock, Users, BarChart3 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type ClockEvent = {
  id: string
  type: "in" | "out"
  timestamp: Date
  location: {
    latitude: number
    longitude: number
  }
  note?: string
  userId: string
  userName: string
}

type LocationPerimeter = {
  center: {
    latitude: number
    longitude: number
  }
  radius: number // in kilometers
}

type Worker = {
  id: string
  name: string
  email: string
  isActive: boolean
  lastClockIn?: Date
  lastClockOut?: Date
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [perimeter, setPerimeter] = useState<LocationPerimeter>({
    center: {
      latitude: 37.7749, // Example: San Francisco
      longitude: -122.4194,
    },
    radius: 2, // 2 kilometers
  })

  // Mock data for demonstration
  const [workers] = useState<Worker[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      isActive: true,
      lastClockIn: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      isActive: true,
      lastClockIn: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      isActive: false,
      lastClockIn: new Date(Date.now() - 86400000),
      lastClockOut: new Date(Date.now() - 50400000),
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      isActive: false,
      lastClockIn: new Date(Date.now() - 172800000),
      lastClockOut: new Date(Date.now() - 136800000),
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      isActive: true,
      lastClockIn: new Date(Date.now() - 1800000),
    },
  ])

  const [clockEvents] = useState<ClockEvent[]>([
    // Generate some mock clock events
    ...Array.from({ length: 20 }).map((_, i) => {
      const userId = String((i % 5) + 1)
      const userName = workers.find((w) => w.id === userId)?.name || "Unknown"
      const dayOffset = Math.floor(i / 2)
      const isClockIn = i % 2 === 0

      return {
        id: `event-${i}`,
        type: isClockIn ? "in" : "out",
        timestamp: new Date(Date.now() - dayOffset * 86400000 - (isClockIn ? 28800000 : 21600000)),
        location: {
          latitude: 37.7749 + (Math.random() * 0.01 - 0.005),
          longitude: -122.4194 + (Math.random() * 0.01 - 0.005),
        },
        note: isClockIn ? "Starting shift" : "Ending shift",
        userId,
        userName,
      }
    }),
  ])

  // Analytics data
  const dailyClockInsData = [
    { day: "Monday", count: 8 },
    { day: "Tuesday", count: 10 },
    { day: "Wednesday", count: 7 },
    { day: "Thursday", count: 9 },
    { day: "Friday", count: 11 },
    { day: "Saturday", count: 5 },
    { day: "Sunday", count: 3 },
  ]

  const avgHoursData = [
    { day: "Monday", hours: 7.5 },
    { day: "Tuesday", hours: 8.2 },
    { day: "Wednesday", hours: 7.8 },
    { day: "Thursday", hours: 8.0 },
    { day: "Friday", hours: 7.2 },
    { day: "Saturday", hours: 6.5 },
    { day: "Sunday", hours: 5.8 },
  ]

  const staffHoursData = workers.map((worker) => ({
    name: worker.name,
    hours: 35 + Math.floor(Math.random() * 10),
  }))

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "manager")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleUpdatePerimeter = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Perimeter Updated",
      description: `Work area updated to ${perimeter.radius}km radius around the specified location.`,
    })
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="active">
          <TabsList className="mb-8">
            <TabsTrigger value="active">
              <Users className="mr-2 h-4 w-4" />
              Active Staff
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              Clock History
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <MapPin className="mr-2 h-4 w-4" />
              Location Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Currently Active Staff</CardTitle>
                <CardDescription>Staff members who are currently clocked in</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Clock In Time</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              worker.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {worker.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>{worker.lastClockIn ? worker.lastClockIn.toLocaleTimeString() : "N/A"}</TableCell>
                        <TableCell>
                          {worker.isActive && worker.lastClockIn
                            ? formatDuration(new Date().getTime() - worker.lastClockIn.getTime())
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Clock In/Out History</CardTitle>
                <CardDescription>Recent clock events for all staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clockEvents.slice(0, 10).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.userName}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              event.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            Clock {event.type === "in" ? "In" : "Out"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          {event.location.latitude.toFixed(6)}, {event.location.longitude.toFixed(6)}
                        </TableCell>
                        <TableCell>{event.note || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Clock-ins</CardTitle>
                  <CardDescription>Number of staff clocking in each day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyClockInsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#0070f3" name="Clock-ins" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Hours Per Day</CardTitle>
                  <CardDescription>Average hours staff are clocked in each day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={avgHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hours" stroke="#0070f3" name="Avg Hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Total Hours Per Staff (Last Week)</CardTitle>
                  <CardDescription>Total hours worked by each staff member over the past week</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffHoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#0070f3" name="Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Location Settings</CardTitle>
                <CardDescription>Set the work location perimeter for clock-in/out</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePerimeter} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={perimeter.center.latitude}
                        onChange={(e) =>
                          setPerimeter({
                            ...perimeter,
                            center: {
                              ...perimeter.center,
                              latitude: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={perimeter.center.longitude}
                        onChange={(e) =>
                          setPerimeter({
                            ...perimeter,
                            center: {
                              ...perimeter.center,
                              longitude: Number.parseFloat(e.target.value),
                            },
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Radius (kilometers)</Label>
                    <Input
                      id="radius"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={perimeter.radius}
                      onChange={(e) =>
                        setPerimeter({
                          ...perimeter,
                          radius: Number.parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <Button type="submit">Update Perimeter</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

  return `${displayHours}h ${displayMinutes}m`
}

