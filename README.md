# Made with very :heart: to Kaios:

# Kdeploy

A simple tool to help you on deploy tasks. 

## Install 

> Globally ( preferred way)

Run `npm install -g kdeploy`

> Project only

Run `npm install kdeploy`

## What is possible to do with this tool?


* **Setup** your environment and install latest adb plataform tools `kdeploy --init` 
* **Install** a KaiOS app from a path  `kdeploy -i <path>` 
* **Uninstall** a KaiOS app using the manifest name `kdeploy -u <APP_NAME>` 
* **Start** a KaiOS App using manifest name `kdeploy --start <APP_NAME>`
* **Stop** a KaiOS App from using manifest name `kdeploy --stop <APP_NAME>`
* **Debug** Enable forward debug on port (default 6000)', this command is internally called on install/uninstall actions
* **Process** Show all b2g process on device `kdeploy --process`
* **Info** Show resource information from device `kdeploy --info`




   

