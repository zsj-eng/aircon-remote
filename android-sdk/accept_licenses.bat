@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set ANDROID_HOME=D:\vscode_test\aircon-remote\android-sdk
set PATH=%JAVA_HOME%\bin;%PATH%
cd /d "%ANDROID_HOME%"
echo y | "%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_HOME%" --licenses
