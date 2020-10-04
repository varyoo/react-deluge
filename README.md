The very first React Front-end for the Deluge BitTorrent client.

# Technical stack

* React
* Electron
* Redux-Saga
* Ant Design

# Screenshots

![react-deluge-login](https://user-images.githubusercontent.com/8150894/95020327-fbb91980-0659-11eb-9e29-79ec8a6ab98d.png)
![react-deluge-downloads](https://user-images.githubusercontent.com/8150894/95020328-fc51b000-0659-11eb-8ef4-e57d64dc07af.png)

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

