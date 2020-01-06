# Resin.io Drone Tracking System

An extensible, Node.js real-time drone monitoring system,

## Solution Summary

>  When one of the Resin's drones takes off with across the country, the drone's ID is added to the table and initial geolation is collected. Geolocation updates are sent every now and then. Keeping the status of drone by a green or yellow signal. Green for drones that have moved more than 1 km and yellow for idle drones (moving less than 1km ). We store the state of drones on the front end and backend with the combination of an in-memory cache and localstorage in the browser. 

> *The Resion.io team should also be able to see drones that not only were idle but fell off the radar and stopped sending geolocation data  (this is good for security. This way we can monitor the arear of last geolocation a drone stopped sending signals at)*


## ASSUMPTIONS AND DECISIONS

>  Why I Chose Websockets? 
I wanted to create a drastic reduction of network traffic in sending data from the drones. During making connection with WebSocket, client and server exchange data per frame which is 2 bytes each, compared to 8 kilo bytes of http header when you do continuous polling with native requests, and long polling by nature will keep accumulating the headers because thats how refrence is kept between clients and server to keep a request in the loop. 

Reducing kilobytes of data to less than 3 bytes of data made the system incredibly fast and you'd notice this in the dashboard too.


## HOW THE SYSTEM WORKS

-   A drone sends in his location signal by [Websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) protocol
-   That drone is sending ONLY a **device_ID** and **geolocation longittude and latitude** (To put data transfer to a minimum)
-   The device_id and location info into the in-memory cache on the node server ⇒ latnlong, updatedAt, droneID
-   To mock the transfer of data a cron job initiates function called *droneCronJob()* that runs on the memory cache every 12 secs to send drone data. 
- It also mimics drones that becomes idle after a while and by sending geolocations **less than 1 km**
-   There is an function to auth against drones that don't have a correct deviceID. All drone data is stored in the drone.js file in data folder. 
- Each devices has a very unique deviceID in this *generic format* (To make a reusable system) **<Resin.DeviceType.92922.GROUP>**

 Example. **Resin.Drone.b2345.aaa**  
 Get their a **device_Id** to use that for authing

## Using The Admin Dashboard
 - Go to the the url -> localhost/admin
 - You will be routed to the login page
 - Login with the pass : **resinadmin**
 - You will immediately see a simple table. (Might take 2-3 seconds to load)


Each device, its location and in fact **the distance it has travelled** is logged.

A robust notification mechanism that keeps track of the drones that suddenly stopped sending geolations and a notification for when those drones are back online.

Devices have a color coded status indicator (**Online/Offline**).

# Good Practices
Structured the code into individual components and utility packages
Wrapped common utilities as npm packages
Used different git branches for unique features; **Routes, Data, Authorization, FrontEnd, Refactoring, Test cases**
Setup Prettier, eslint and babel
Added scripts to the package.json. ...
Used environment variables for keeping important values ...
Used async throughout the codebase
All errors were handled properly
Node leakages handled properly
Setup hot reload [app automatically restarts on change]

## Tests, CI and Containers

- Docker
- Travis CI
- Eslint Mocha & API component Tests

## How To Run The App

`yarn install` to create our node_modules folder
Instal mocha globally

Change `.env_example` to `.env`
Run the `yarn build` to export js into folder called lib with babel
Run `yarn lint` to lint test what we have in the lib
Run the tests with `yarn test`
Run the below docker commands

`docker build -t resindrone .`
`docker run -p 4500:4500 -p 5000:5000 resindrone`

Build context to Docker daemon is 56.05MB [well trimmed]
Go to http://0.0.0.0:4500/admin/home and log in with password: **resinadmin**

Trade offs 
1. Express made the app bigger it could be a 15-20 MB docker file without express server and its dependencies
2. Left out babel because of its size and depended on best practices and prettier styling