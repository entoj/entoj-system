#!/bin/bash

# Prepare
export FORCE_COLOR=true

# Prepare pathes
SELF=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ROOT="$SELF/../.."
CLI="$SELF/source/cli.js"
PROFILE="false"
INSPECT="false"

# Prepare options
for arg do
  shift
  [ "$arg" = "--profile" ] && PROFILE="true" && continue
  set -- "$@" "$arg"
done

# Prepare runner
if [ "$PROFILE" == "true" ]
    then
        echo "Enabling profiler"
        RUNNER="node --inspect $SELF/source/cli.js"
    else
        RUNNER="node $SELF/source/cli.js"
fi

# Doit
$RUNNER "$@";
