@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot
set ANDROID_HOME=D:\vscode_test\aircon-remote\android-sdk
set PATH=%JAVA_HOME%\bin;%PATH%
echo Installing Android SDK packages...
"%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat" --sdk_root="%ANDROID_HOME%" "platform-tools" "build-tools;34.0.0" "platforms;android-34"
echo Exit code: %ERRORLEVEL%
