#!/bin/bash

# Prepare pathes
SELF=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT="$SELF/../.."
CLI="$SELF/source/cli.js"
COMMAND="$1"

node $CLI "$@"
