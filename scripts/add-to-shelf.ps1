<#
Adds one item to the Reading Shelf by fetching link-preview metadata from Iframely.

Usage:
  .\scripts\add-to-shelf.ps1 -Url "https://example.com/some-article"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Url
)

$ErrorActionPreference = "Stop"

$scriptRoot = $PSScriptRoot
$projectRoot = Split-Path $scriptRoot -Parent
$keyPath = Join-Path $scriptRoot "iframely.key.txt"
$shelfPath = Join-Path $projectRoot "data\shelf.json"

if (-not (Test-Path $keyPath)) {
    Write-Output "No API key found at $keyPath"
    Write-Output "Sign up for a free Iframely key at https://iframely.com, then create that file containing just the key (no quotes, no extra whitespace)."
    exit 1
}

$apiKey = (Get-Content $keyPath -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Output "$keyPath exists but is empty. Paste your Iframely API key into it and try again."
    exit 1
}

$encodedUrl = [System.Uri]::EscapeDataString($Url)
$apiUrl = "https://iframe.ly/api/iframely?url=$encodedUrl&api_key=$apiKey"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get
}
catch {
    Write-Output "Iframely request failed: $($_.Exception.Message)"
    exit 1
}

$title = $response.meta.title
$description = $response.meta.description
$siteName = $response.meta.site
if ([string]::IsNullOrWhiteSpace($siteName)) {
    $siteName = ([System.Uri]$Url).Host
}

$image = ""
if ($response.links.thumbnail -and $response.links.thumbnail.Count -gt 0) {
    $image = $response.links.thumbnail[0].href
}

if ([string]::IsNullOrWhiteSpace($title)) {
    Write-Output "Iframely didn't return a title for this URL - skipping. Raw response:"
    $response | ConvertTo-Json -Depth 5
    exit 1
}

$newEntry = [ordered]@{
    url         = $Url
    title       = $title
    description = $description
    image       = $image
    siteName    = $siteName
    dateAdded   = (Get-Date -Format "yyyy-MM-dd")
}

$existingItems = New-Object System.Collections.ArrayList
if (Test-Path $shelfPath) {
    $parsed = ConvertFrom-Json (Get-Content $shelfPath -Raw)
    foreach ($item in $parsed) {
        [void]$existingItems.Add($item)
    }
}
[void]$existingItems.Add([PSCustomObject]$newEntry)

$json = ConvertTo-Json -InputObject $existingItems.ToArray() -Depth 5
if ($json -notmatch '^\s*\[') {
    $json = "[$json]"
}

Set-Content -Path $shelfPath -Value $json -Encoding utf8

Write-Output "Added to shelf: $title ($siteName)"
