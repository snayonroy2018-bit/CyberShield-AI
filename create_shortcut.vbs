Set WshShell = WScript.CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\CyberShield AI.lnk")
oShellLink.TargetPath = "c:\Users\snayo\Downloads\coding\start_app.bat"
oShellLink.WorkingDirectory = "c:\Users\snayo\Downloads\coding"
oShellLink.WindowStyle = 1
oShellLink.Description = "Launch CyberShield AI Web Application"
oShellLink.Save
