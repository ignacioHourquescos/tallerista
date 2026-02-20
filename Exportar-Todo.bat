@echo off
chcp 65001 >nul
title Exportar Todo a Excel - Renova Product Quotator
color 0A

cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     EXPORTAR TODO A EXCEL - RENOVA PRODUCT QUOTATOR      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Exportando todos los datos a data.xlsx...
echo.
echo Esto incluye:
echo   - Filter Kits
echo   - Filters
echo   - Lubricants
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar que node está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado o no está en el PATH
    echo.
    pause
    exit /b 1
)

REM Verificar que npm está instalado
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: npm no está instalado o no está en el PATH
    echo.
    pause
    exit /b 1
)

REM Ejecutar el script de exportación
echo Ejecutando script de exportación...
echo.
call npm run export:all

if %errorlevel% equ 0 (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo ✅ Exportación completada exitosamente
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo El archivo data.xlsx ha sido generado en la raíz del proyecto.
    echo.
) else (
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo ❌ Error durante la exportación
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo Revisa los mensajes de error anteriores.
    echo.
)

pause
exit /b %errorlevel%

