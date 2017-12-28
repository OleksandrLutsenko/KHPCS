#!/bin/bash

find  ./storage/contracts/*.log -mtime +1 -exec rm -f {} \;
