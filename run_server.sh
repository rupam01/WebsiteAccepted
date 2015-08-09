#!/bin/bash

CHECK="$(sudo netstat -tulpn | grep :80)"
echo "sasd " + $CHECK


if [ -z "$CHECK" ]
then
  echo "\$ Starting Server"
  exec sudo /usr/local/bin/node /home/zharris/website/app.js  >> /home/zharris/node.log 2>&1
  echo "\$ Server done"
else
  echo "\$Server is already running!."
fi     # $String is null.
