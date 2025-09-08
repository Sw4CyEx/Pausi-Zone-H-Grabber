"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Globe, Users, Archive, Star, Trash2 } from "lucide-react"

export default function PausiApp() {
  const [phpsessid, setPhpsessid] = useState("")
  const [zhe, setZhe] = useState("")
  const [notifier, setNotifier] = useState("")
  const [notifierList, setNotifierList] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const [status, setStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)

  const handleScrape = async (mode: string) => {
    if (!phpsessid || !zhe) {
      setStatus("Please enter PHPSESSID and ZHE cookies")
      return
    }

    setIsLoading(true)
    setResults([])
    setCurrentPage(0)
    setTotalPages(0)
    setProgressPercentage(0)
    setStatus("Starting scrape...")

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phpsessid,
          zhe,
          mode,
          notifier: mode === "single" ? notifier : undefined,
          notifierList: mode === "mass" ? notifierList.split("\n").filter((n) => n.trim()) : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Scraping failed")
      }

      const reader = response.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split("\n").filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.type === "url") {
              setCurrentUrl(data.url)
            } else if (data.type === "result") {
              setResults((prev) => [...prev, data.url])
            } else if (data.type === "status") {
              setStatus(data.message)
            } else if (data.type === "error") {
              setStatus(`Error: ${data.message}`)
            } else if (data.type === "progress") {
              setCurrentPage(data.currentPage)
              setTotalPages(data.totalPages)
              setProgressPercentage(data.percentage)
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      setCurrentUrl("")
      setCurrentPage(0)
      setTotalPages(0)
      setProgressPercentage(0)
    }
  }

  const downloadResults = () => {
    if (results.length === 0) return

    const content = results.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Result.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearResults = () => {
    setResults([])
    setStatus("")
    setCurrentUrl("")
    setCurrentPage(0)
    setTotalPages(0)
    setProgressPercentage(0)
  }

  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #020617 0%, #581c87 50%, #020617 100%) !important;
          min-height: 100vh;
        }
        html {
          background: #020617 !important;
        }
      `}</style>
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-mono drop-shadow-lg" style={{ color: "#ffffff" }}>
              Pausi Zone-H Grabber
            </h1>
            <p className="text-lg drop-shadow" style={{ color: "#e2e8f0" }}>
              Mass Zone-H URL scraper
            </p>
            <div className="flex justify-center gap-2 text-sm">
              <Badge variant="outline" className="border-slate-500 bg-slate-800/30" style={{ color: "#e2e8f0" }}>
                Author: Sw4CyEx
              </Badge>
              <Badge variant="outline" className="border-slate-500 bg-slate-800/30" style={{ color: "#e2e8f0" }}>
                D704T
              </Badge>
            </div>
          </div>

          {/* Session Configuration */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Session Configuration</CardTitle>
              <CardDescription className="text-slate-400">Enter your Zone-H session cookies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">PHPSESSID</label>
                <Input
                  type="password"
                  placeholder="Enter PHPSESSID cookie"
                  value={phpsessid}
                  onChange={(e) => setPhpsessid(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">ZHE</label>
                <Input
                  type="password"
                  placeholder="Enter ZHE cookie"
                  value={zhe}
                  onChange={(e) => setZhe(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Scraping Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Single Notifier */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Single Notifier
                </CardTitle>
                <CardDescription className="text-slate-400">Grab URLs from a specific notifier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter notifier name"
                  value={notifier}
                  onChange={(e) => setNotifier(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={() => handleScrape("single")}
                  disabled={isLoading || !notifier.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Grab Single
                </Button>
              </CardContent>
            </Card>

            {/* Mass Notifier */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Mass Notifier
                </CardTitle>
                <CardDescription className="text-slate-400">Grab URLs from multiple notifiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter notifier names (one per line)"
                  value={notifierList}
                  onChange={(e) => setNotifierList(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
                <Button
                  onClick={() => handleScrape("mass")}
                  disabled={isLoading || !notifierList.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Grab Mass
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Archive Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Special Archive
                </CardTitle>
                <CardDescription className="text-slate-400">Grab from special archive section</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleScrape("special")}
                  disabled={isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Grab Special
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Full Archive
                </CardTitle>
                <CardDescription className="text-slate-400">Grab from entire archive</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleScrape("archive")}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Grab Archive
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status and Results */}
          {(status || currentUrl || results.length > 0 || isLoading) && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Results
                  <div className="flex gap-2">
                    {results.length > 0 && (
                      <>
                        <Button
                          onClick={clearResults}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                        <Button onClick={downloadResults} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download Result.txt ({results.length})
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && totalPages > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>
                        Progress: Page {currentPage} of {totalPages}
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="w-full" />
                  </div>
                )}
                {status && <div className="text-sm text-slate-300 bg-slate-700/50 p-3 rounded">Status: {status}</div>}
                {currentUrl && (
                  <div className="text-sm text-yellow-400 bg-slate-700/50 p-3 rounded">Current: {currentUrl}</div>
                )}
                {results.length > 0 && (
                  <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-4 rounded font-mono text-sm">
                    {results.map((url, index) => (
                      <div key={index} className="text-blue-400 hover:text-blue-300">
                        {url}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
