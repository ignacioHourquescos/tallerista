Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\Gestionar Excel.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = WScript.Arguments(0) & "\Gestionar-Excel.bat"
oLink.WorkingDirectory = WScript.Arguments(0)
oLink.Description = "Gestor de Excel - Renova Product Quotator"
' Usar icono de Excel si está disponible, sino usar icono de sistema
oLink.IconLocation = "C:\Windows\System32\shell32.dll,1"
oLink.Save
WScript.Echo "✅ Acceso directo creado en el escritorio: Gestionar Excel.lnk"

