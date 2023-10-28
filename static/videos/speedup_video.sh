#!/bin/bash

ffmpeg -i teaser_v2.mp4  -vf "setpts=0.4*PTS" -an out.mp4