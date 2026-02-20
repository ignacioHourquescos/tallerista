$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$Desktop\Gestionar Excel.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\Gestionar-Excel.bat"
$Shortcut.WorkingDirectory = "$PSScriptRoot"
$Shortcut.Description = "Gestor de Excel - Renova Product Quotator"
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,1"
$Shortcut.Save()
Write-Host "✅ Acceso directo creado en el escritorio: Gestionar Excel.lnk" -ForegroundColor Green

