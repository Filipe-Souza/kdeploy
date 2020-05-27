#!/bin/bash

echo Downloading latest ADB tool

wget -q https://dl.google.com/android/repository/platform-tools-latest-linux.zip

echo Exctracting files

unzip -qq -o \platform-tools-latest-linux.zip

echo Installing files

sudo cp -f platform-tools/adb /usr/bin/adb

sudo cp -f platform-tools/fastboot /usr/bin/fastboot

sleep 2

echo Clean up

rm -rf platform-tools-latest-linux.zip 
rm -rf platform-tools

echo -------------- ADB VERSION --------------
echo 

adb version
