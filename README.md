# React-Deluge

The very first React Front-end for the Deluge BitTorrent client.

## Technical stack

* Electron
* React
* Redux-Saga
* Ant Design
* Testing Library

## Screenshots

![react-deluge-login](https://user-images.githubusercontent.com/8150894/95030169-4e67f500-069d-11eb-950c-34c66e40335c.png)
![react-deluge-downloads](https://user-images.githubusercontent.com/8150894/95607386-3270a480-0a4b-11eb-8497-b527eef01b6e.png)
![react-deluge-add](https://user-images.githubusercontent.com/8150894/95485954-eefe3380-0981-11eb-9978-8410b152a9e8.png)
![react-deluge-details](https://user-images.githubusercontent.com/8150894/95607395-356b9500-0a4b-11eb-8d96-cbdc5391ae91.png)

## Arch Linux package

Easy as `trizen -S react-deluge-git`

See https://aur.archlinux.org/packages/react-deluge-git/

## Installation guide

### Deluge daemon

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

Configure deluged :

In `~/.config/deluged/core.conf`,
find `"allow_remote"` and set it to `true`:

~~~json
"allow_remote": true
~~~

Start deluged :

~~~sh
systemctl --user start deluged
~~~

### Build

`node-deluge-rpc` is bundled as a submodule because the npm package is outdated.

~~~sh
cd node-deluge-rpc
npm install
cd ..
npm install
# start Electron web app
npm start
~~~

