; Отключаем проверку CRC для решения проблемы с NSIS
CRCCheck off

!macro customInit
  DetailPrint "Инициализация oneClick установщика..."
!macroend

!macro customInstall
  DetailPrint "Установка приложения..."
!macroend

!macro customUnInstall
  DetailPrint "Удаление приложения..."
!macroend 