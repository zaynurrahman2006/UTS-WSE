$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$ssDir = "D:\wse uts\simadu-api\screenshots"

# 1. Render Terminal Test Results
Start-Process -FilePath $chromePath -ArgumentList "--headless", "--disable-gpu", "--screenshot=`"$ssDir\terminal_test_results.png`"", "--window-size=1000,780", "file:///$ssDir/terminal_view.html" -Wait

# 2. Render Server Terminal
Start-Process -FilePath $chromePath -ArgumentList "--headless", "--disable-gpu", "--screenshot=`"$ssDir\server_terminal.png`"", "--window-size=1000,450", "file:///$ssDir/server_view.html" -Wait

# 3. Render Swagger UI Overview
Start-Process -FilePath $chromePath -ArgumentList "--headless", "--disable-gpu", "--screenshot=`"$ssDir\swagger_ui_overview.png`"", "--window-size=1280,850", "http://localhost:3000/docs" -Wait

# 4. Render Swagger UI Full Endpoints
Start-Process -FilePath $chromePath -ArgumentList "--headless", "--disable-gpu", "--screenshot=`"$ssDir\swagger_ui_endpoints.png`"", "--window-size=1280,1400", "http://localhost:3000/docs" -Wait

Write-Host "Hasil tangkapan layar:"
Get-ChildItem -Path $ssDir -Filter "*.png" | Select-Object Name, Length
