#!/bin/bash

./gradlew assembleRelease && mv ./app/build/outputs/apk/release/app-release.apk $1
