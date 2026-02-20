@echo off
chcp 65001 >nul
title Gestor de Excel - Renova Product Quotator
color 0A

:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     GESTOR DE EXCEL - RENOVA PRODUCT QUOTATOR           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo Selecciona una opción:
echo.
echo   1. Exportar TODO a Excel (data.xlsx con 2 hojas)
echo   2. Importar TODO desde Excel (genera ambos JSON)
echo   3. Importar Filter Kits desde Excel
echo   4. Importar Filters desde Excel
echo   5. Exportar Filter Kits a Excel (individual)
echo   6. Exportar Filters a Excel (individual)
echo   7. Salir
echo.
set /p opcion="Opción: "

if "%opcion%"=="1" goto export_all
if "%opcion%"=="2" goto import_all
if "%opcion%"=="3" goto import_filter_kits
if "%opcion%"=="4" goto import_filters
if "%opcion%"=="5" goto export_filter_kits
if "%opcion%"=="6" goto export_filters
if "%opcion%"=="7" goto end
goto menu

:export_all
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Exportando TODO a data.xlsx...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run export:all
echo.
pause
goto menu

:import_all
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Importando TODO desde Excel (generando ambos JSON)...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run import:all
echo.
pause
goto menu

:import_filter_kits
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Importando Filter Kits desde Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run import:filter-kits
echo.
pause
goto menu

:import_filters
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Importando Filters desde Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run import:filters
echo.
pause
goto menu

:export_filter_kits
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Exportando Filter Kits a Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run export:filter-kits
echo.
pause
goto menu

:export_filters
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Exportando Filters a Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run export:filters
echo.
pause
goto menu

:end
cls
echo.
echo ¡Hasta luego!
echo.
timeout /t 2 >nul
exit

