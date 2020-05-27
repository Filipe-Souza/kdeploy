#!/bin/bash

# Get list all devices without first line
kaios=$(adb devices | cut -f1 | tail -n +2);

for i in $kaios; 
do
    # Count with device has some props with name kaios
    qtdProps=$(adb -s $i shell getprop|grep kaios|wc -l);
    if [ $qtdProps -gt 0 ]
    then
        KAIOS_ID=$i;
    fi
done
echo $KAIOS_ID;