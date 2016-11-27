#!/bin/bash
sudo hciconfig hci0 down
sudo hciconfig hci0 up
sudo hciconfig hci0 leadv 3
sudo hcitool -i hci0 cmd 0x08 0x0008 1e 02 01 06 03 03 aa fe 16 16 aa fe 10 00 02 73 74 69 6a 6e 76 61 6e 68 75 6c 6c 65 2e 62 65 00
