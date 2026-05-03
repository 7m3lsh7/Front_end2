$body = @{ subjectName = 'Physics'; stage = 'junior' } | ConvertTo-Json
try {
    $res = Invoke-RestMethod -Uri 'http://localhost:5033/api/Subjects' -Method Post -Body $body -ContentType 'application/json'
    Write-Output "Success:"
    Write-Output ($res | ConvertTo-Json)
} catch {
    Write-Output "Error:"
    Write-Output $_.Exception.Response
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Output ($reader.ReadToEnd())
    }
}
