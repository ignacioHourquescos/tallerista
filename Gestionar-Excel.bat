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
echo   1. Exportar TODO a Excel (data.xlsx con todas las hojas)
echo   2. Importar TODO desde Excel (genera todos los JSON)
echo   3. Importar Filter Kits desde Excel
echo   4. Importar Filters desde Excel
echo   5. Importar Lubricants desde Excel
echo   6. Exportar Filter Kits a Excel (individual)
echo   7. Exportar Filters a Excel (individual)
echo   8. Exportar Lubricants a Excel (individual)
echo   9. Salir
echo.
set /p opcion="Opción: "

if "%opcion%"=="1" goto export_all
if "%opcion%"=="2" goto import_all
if "%opcion%"=="3" goto import_filter_kits
if "%opcion%"=="4" goto import_filters
if "%opcion%"=="5" goto import_lubricants
if "%opcion%"=="6" goto export_filter_kits
if "%opcion%"=="7" goto export_filters
if "%opcion%"=="8" goto export_lubricants
if "%opcion%"=="9" goto end
goto menu

:export_all
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Exportando TODO a data.xlsx (Filter Kits, Filters, Lubricants)...
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
echo Importando TODO desde Excel (generando todos los JSON)...
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

:import_lubricants
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Importando Lubricants desde Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run import:lubricants
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

:export_lubricants
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo Exportando Lubricants a Excel...
echo ═══════════════════════════════════════════════════════════
echo.
call npm run export:lubricants
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

