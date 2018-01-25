#!/bin/bash

# Prepare
export FORCE_COLOR=true

# Prepare pathes
SELF=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PROFILE="false"

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
        RUNNER="node --stack_size=1500 --inspect $SELF/source/cli.js"
    else
        RUNNER="node --stack_size=1500 $SELF/source/cli.js"
fi

# Doit
$RUNNER "$@";
