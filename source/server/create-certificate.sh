#!/bin/bash

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 1825 -nodes -subj "/C=DE/ST=Hessen/L=Hessen/O=Entoj Corp/OU=Org/CN=localhost" -keyout localhost.key -out localhost.crt
