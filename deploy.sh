#!/bin/sh
cd activities;
python manage.py deploy;
cd ..;
cd button;
python manage.py deploy;
cd ..;
cd device;
python manage.py deploy;
cd ..;
cd digitalSTROM;
python manage.py deploy;
cd ..;
cd usage;
python manage.py deploy;
cd ..;
cd zone;
python manage.py deploy;
cd ..;
