$procs = Get-Process python -ErrorAction SilentlyContinue
foreach ($p in $procs) {
    Write-Host "PID: $($p.Id) | CPU: $($p.CPU) | Path: $($p.Path)"
}
if ($procs.Count -eq 0) {
    Write-Host "Tidak ada proses python.exe yang ditemukan lewat Get-Process!"
}
