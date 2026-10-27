# HER SAFE ROUTE - Rock-Solid TCP HTTP Server
# Zero dependencies, pure .NET Sockets, accepts any Host header

param([int]$Port = 8080)

$baseDir = "C:\Users\Admin\.gemini\antigravity\scratch\her-safe-route"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()

Write-Host "Universal Web Server running on port $Port for all domains..." -ForegroundColor Cyan

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)
            $line = $reader.ReadLine()
            if ($line) {
                $parts = $line.Split(' ')
                if ($parts.Length -ge 2) {
                    $rawPath = $parts[1].Split('?')[0]
                    if ($rawPath -eq "/" -or [string]::IsNullOrWhiteSpace($rawPath)) {
                        $rawPath = "/index.html"
                    }
                    $relPath = $rawPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
                    $localFile = [System.IO.Path]::Combine($baseDir, $relPath)

                    if ([System.IO.File]::Exists($localFile)) {
                        $bytes = [System.IO.File]::ReadAllBytes($localFile)
                        $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
                        $mime = "application/octet-stream"
                        if ($ext -eq ".html") { $mime = "text/html; charset=utf-8" }
                        elseif ($ext -eq ".css") { $mime = "text/css; charset=utf-8" }
                        elseif ($ext -eq ".js") { $mime = "application/javascript; charset=utf-8" }
                        elseif ($ext -eq ".json") { $mime = "application/json; charset=utf-8" }
                        elseif ($ext -eq ".svg") { $mime = "image/svg+xml" }
                        elseif ($ext -eq ".png") { $mime = "image/png" }

                        $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                        $hBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        $stream.Write($hBytes, 0, $hBytes.Length)
                        $stream.Write($bytes, 0, $bytes.Length)
                        $stream.Flush()
                    } else {
                        $notFound = "HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                        $hBytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
                        $stream.Write($hBytes, 0, $hBytes.Length)
                        $stream.Flush()
                    }
                }
            }
        } catch {
            # Ignore client disconnects
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
