#!/bin/bash

pattern=$1
tmp_filename="tmp.mp4"

for file in $( ls $pattern )
do
    echo $file
    ffmpeg -i $file -vf tpad=stop_mode=clone:stop_duration=2 $tmp_filename
    rm $file
    mv $tmp_filename $file
done

