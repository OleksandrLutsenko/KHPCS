#!/bin/bash

find ./storage/contracts/*.log -type f -mmin +60 -exec rm {} \;
