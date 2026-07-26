Get-NetTCPConnection | Where-Object { $_.RemotePort -eq 5432 -or $_.LocalPort -eq 8000 } | Select-Object LocalAddress, LocalPort, RemotePort, State, OwningProcess
