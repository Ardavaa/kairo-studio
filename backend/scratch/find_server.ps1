$processes = Get-CimInstance Win32_Process | Where-Object { 
    $_.Name -like '*python*' -or 
    $_.Name -like '*uvicorn*' -or 
    $_.CommandLine -like '*8000*' -or 
    $_.CommandLine -like '*kairo*' 
}
foreach ($p in $processes) {
    Write-Host "PID: $($p.ProcessId) | Name: $($p.Name)"
    Write-Host "Cmd: $($p.CommandLine)"
    Write-Host "------------------------------------------------"
}
