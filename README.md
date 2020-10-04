The very first React Front-end for the Deluge BitTorrent client.

# Technical stack

* React
* Electron
* Redux-Saga
* Ant Design

# Screenshots

![react-deluge-login](https://user-images.githubusercontent.com/8150894/95020742-73884380-065c-11eb-9e9a-4827e3c66fd1.png)
![react-deluge-downloads](https://user-images.githubusercontent.com/8150894/95020743-76833400-065c-11eb-8eb2-68acae9855c4.png)

# Installation guide

## Deluge daemon

Configure deluged `~/.config/systemd/user/deluged.service`:

~~~txt
[Unit]
Description=Deluge Daemon
After=network.target

[Service]
ExecStart=/usr/bin/deluged -d -P %h/.config/deluge/deluge.pid

[Install]
WantedBy=default.target
~~~

Configure authentication `~/.config/deluged/auth`:

~~~txt
youruser:yourpassword:10
~~~

Start deluged :

~~~sh
systemctl --user start deluged
~~~

## Build

`node-deluge-rpc` is bundled as a submodule because the npm package is outdated.

~~~sh
cd node-deluge-rpc
npm install
cd ..
npm install
# start Electron web app
npm start
~~~

