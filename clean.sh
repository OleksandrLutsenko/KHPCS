#!/bin/bash
exec 2>/var/www/bash.log

find /var/www/knightshayes.api/storage/contracts/*.* -type f -mmin +1 -exec rm {} \;
