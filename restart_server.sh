#!/bin/bash

CHECK="$(sudo netstat -tulpn | grep :80 | awk '{print $7}' | sed 's=/node==')"
echo "Server previously running as PID: " + $CHECK


if [ -z "$CHECK" ]
then
  echo "\$ Starting Server"
  exec sudo /usr/local/bin/node /home/zharris/website/app.js  >> /home/zharris/node.log 2>&1
  echo "\$ Server done"
else
  exec sudo kill $CHECK
  echo "\$Server is already running!."
  echo "\$ Starting Server"
  exec sudo /usr/local/bin/node /home/zharris/website/app.js  >> /home/zharris/node.log 2>&1
  echo "\$ Server done"
fi     # $String is null.
