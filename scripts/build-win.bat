@echo off
setlocal

set ROOT=%~dp0..

cd /d "%ROOT%\..\..\core\windows\ScreenWire.Windows"
dotnet publish -c Release -r win-x64 /p:NativeLib=Shared /p:SelfContained=true /p:PublishAot=true -o "%ROOT%\builds\windows"
if %errorlevel% neq 0 exit /b %errorlevel%

cd /d "%ROOT%"
call node_modules\.bin\node-gyp rebuild
if %errorlevel% neq 0 exit /b %errorlevel%

copy /y build\Release\screenwire.node builds\windows\screenwire.node
echo Done: builds\windows\screenwire.node
