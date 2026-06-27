# build-apks.ps1 — 一键打两个安卓包：正式（纯净）版 + 路演（演示）版
#
# 正式版：com.jinwanzaodian.app        名「今晚早点」      无 demo 数据
# 路演版：com.jinwanzaodian.app.demo   名「今晚早点·演示」 有预填示例数据 + 首次说明弹窗
# 两个包名不同，可在同一部手机上同时安装。
#
# 跑法（在 app 目录）：powershell -ExecutionPolicy Bypass -File scripts\build-apks.ps1
# 产物复制到桌面：今晚早点.apk、今晚早点-演示.apk
# 注：仍是 assembleDebug（debug 签名包，可直接装），只是输出文件名不带 debug 字样。

$ErrorActionPreference = "Stop"
$env:JAVA_HOME = "D:\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\happy\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

$apk = "android\app\build\outputs\apk\debug\app-debug.apk"
$desktop = "D:\Desktop\zaodian"

function Build-One($demo, $outName, $gradleArgs) {
    Write-Host "`n=== building $outName ===" -ForegroundColor Cyan
    if ($demo) { $env:VITE_DEMO = "1" } else { $env:VITE_DEMO = $null }
    npx vite build --base=./
    npx cap sync android
    Push-Location android
    & .\gradlew.bat assembleDebug --no-daemon -q @gradleArgs
    Pop-Location
    Copy-Item $apk (Join-Path $desktop $outName) -Force
    Write-Host "done -> $desktop\$outName" -ForegroundColor Green
}

# 先 tsc 过一遍类型（两版共用同一份源码）
npx tsc

# 正式（纯净）版
Build-One $false "今晚早点.apk" @()
# 路演（演示）版：VITE_DEMO=1 注入示例数据，gradle -Pdemo 加包名后缀+改名
Build-One $true  "今晚早点-演示.apk" @("-Pdemo")

$env:VITE_DEMO = $null
Write-Host "`nBoth APKs built to desktop." -ForegroundColor Green