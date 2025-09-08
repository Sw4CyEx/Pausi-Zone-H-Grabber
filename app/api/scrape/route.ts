import type { NextRequest } from "next/server"

interface ScrapeRequest {
  phpsessid: string
  zhe: string
  mode: "single" | "mass" | "special" | "archive"
  notifier?: string
  notifierList?: string[]
}

export async function POST(request: NextRequest) {
  const { phpsessid, zhe, mode, notifier, notifierList }: ScrapeRequest = await request.json()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendMessage = (type: string, data: any) => {
        const message = JSON.stringify({ type, ...data }) + "\n"
        controller.enqueue(encoder.encode(message))
      }

      try {
        let urls: string[] = []

        switch (mode) {
          case "single":
            if (notifier) {
              urls = [`http://zone-h.org/archive/notifier=${notifier}?`]
            }
            break
          case "mass":
            if (notifierList) {
              urls = notifierList.map((n) => `http://zone-h.org/archive/notifier=${n}?`)
            }
            break
          case "special":
            urls = ["http://zone-h.org/archive/special=1/"]
            break
          case "archive":
            urls = ["http://zone-h.org/archive/"]
            break
        }

        for (const baseUrl of urls) {
          await scrapeUrl(baseUrl, phpsessid, zhe, sendMessage)
        }

        sendMessage("status", { message: "Scraping completed" })
      } catch (error) {
        sendMessage("error", { message: error instanceof Error ? error.message : "Unknown error" })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  })
}

async function scrapeUrl(
  baseUrl: string,
  phpsessid: string,
  zhe: string,
  sendMessage: (type: string, data: any) => void,
) {
  const estimatedTotalPages = 50
  sendMessage("progress", { currentPage: 0, totalPages: estimatedTotalPages, percentage: 0 })

  for (let page = 1; page <= 50; page++) {
    try {
      const url = baseUrl + `page=${page}`
      sendMessage("url", { url })

      const percentage = Math.round((page / estimatedTotalPages) * 100)
      sendMessage("progress", { currentPage: page, totalPages: estimatedTotalPages, percentage })

      const response = await fetch(url, {
        headers: {
          Cookie: `PHPSESSID=${phpsessid}; ZHE=${zhe}`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.ok) {
        sendMessage("error", { message: `HTTP ${response.status} for ${url}` })
        continue
      }

      const html = await response.text()

      // Check for captcha
      if (html.includes('<input type="text" name="captcha"')) {
        sendMessage("error", { message: "Captcha detected - please update ZHE cookie" })
        break
      }

      // Check for session error
      if (html.includes('<html><body>-<script type="text/javascript"')) {
        sendMessage("error", { message: "Session error - please update PHPSESSID and ZHE cookies" })
        break
      }

      const urlMatches = html.match(/<td>(.+?)\s*<\/td>/g)
      if (!urlMatches || urlMatches.length === 0) {
        sendMessage("status", { message: `No more results found at page ${page}` })
        sendMessage("progress", { currentPage: page, totalPages: page, percentage: 100 })
        break
      }

      const extractedUrls = urlMatches
        .map((match) => {
          const content = match.replace(/<\/?td>/g, "").trim()
          return extractDomainFromContent(content)
        })
        .filter((url): url is string => url !== null && url.length > 0)
        .filter((url, index, array) => array.indexOf(url) === index) // Remove duplicates

      for (const extractedUrl of extractedUrls) {
        sendMessage("result", { url: extractedUrl })
      }

      sendMessage("status", { message: `Page ${page} completed - found ${extractedUrls.length} URLs` })

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      sendMessage("error", {
        message: `Error on page ${page}: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
      break
    }
  }
}

function extractDomainFromContent(content: string): string | null {
  // Remove HTML tags and decode entities
  const cleanContent = content.replace(/<[^>]*>/g, "").trim()

  // Skip if content is too short or contains file extensions
  if (cleanContent.length < 4 || /\.(gif|png|jpg|jpeg|css|js|ico|svg)$/i.test(cleanContent)) {
    return null
  }

  // Skip if content is an IP address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(cleanContent)) {
    return null
  }

  // Skip if content is just a single character or number
  if (/^[a-zA-Z0-9]$/.test(cleanContent)) {
    return null
  }

  // Try to extract domain pattern: word.word.tld
  const domainPattern = /([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/
  const domainMatch = cleanContent.match(domainPattern)

  if (domainMatch) {
    const domain = domainMatch[0].toLowerCase()

    // Additional validation: must have at least one dot and valid TLD
    if (domain.includes(".") && domain.split(".").length >= 2) {
      const parts = domain.split(".")
      const tld = parts[parts.length - 1]

      // Check if TLD is at least 2 characters and contains only letters
      if (tld.length >= 2 && /^[a-zA-Z]+$/.test(tld)) {
        return domain
      }
    }
  }

  return null
}
