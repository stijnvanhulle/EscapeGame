#!/usr/bin/env python

import time
import datetime
import math
import sys
import trollius
import json
from trollius import From
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import grovepi
import grove_rgb_lcd as lcd
from concurrent.futures import ProcessPoolExecutor

import faceDetection

# CONNECTORS

#moisure=0

display_status=""

# PINMODES
#INPUT


#OUTPUT
#grovepi.pinMode(relay,"OUTPUT")

#variables
ports=[0,1,2,3,4,5,6,7,8]
isReading=False
MQTT_BROKER="localhost"
client = mqtt.Client()

#classes
class Input:

	temp = 0
	hum = 0
	range = 0
	pressed=False

def getStatusBool(ok):
	if ok==True :
		return 1
	else:
		return 0
def isFloat(str):
	try:
		float(str)
		return True
	except ValueError:
		return False
def in_between(now, start, end):
	if start <= end:
		return start <= now < end
	else: # over midnight e.g., 23:30-04:15
		return start <= now or now < end

def on_connect(client, userdata, rc):
	print("Connected to MQTT-broker on " + MQTT_BROKER )
	client.subscribe("online")
	client.subscribe("message")

def on_message(client, userdata, msg):

	if msg.topic=="online":
		parsed_json=json.loads(str(msg.payload))
		

	if msg.topic=="message":
		parsed_json=json.loads(str(msg.payload))
		_type =parsed_json['type']
		_port=parsed_json['port']
		_read=parsed_json['read']
		if _read:
			if _type is not None  and _port is not None:
				
				sensor_value=0
				grovepi.pinMode(_port,_type)

				sensor_value = grovepi.analogRead(_port)
				if sensor_value is None:
					sensor_value = grovepi.digitalRead(_port)
					isDigital=True
			 	
			 	if sensor_value:
			 		client.publish("message", makeJsonObject(sensor_value,_port,_type))
			 		print('Port ' + str(_port) + ' ' + sensor_value)
	 					
		else:
			_value=parsed_json['value']
			if _type is not None and _value is not None and _port is not None and _read is not None:
				if isFloat(_port):
					grovepi.pinMode(_port,_type)
					if _value==True:
						grovepi.digitalWrite(_port,1)
						print('Port '+ str(_port) + ' is on')

					elif _value==False:
						grovepi.digitalWrite(_port,0)
						print('Port '+ str(_port) + ' is off')
						
		 		elif str(_port)=="I2C-1" or str(_port)=="I2C-2" or str(_port)=="I2C-3":
		 			print('Text to display: '+ str(_value))
					lcd.setText(str(_value))

	if msg.topic=="detection":
		parsed_json=json.loads(str(msg.payload))
		_image1 =parsed_json['image1']
		_image2 =parsed_json['image2']	
		_read=parsed_json['read']
		if _read:
			if _image1 is not None  and _image2 is not None:
			percent=faceDetection.get(_image1,_image2)
			client.publish("detection", makeJsonObject_detection(percent))			
			
			


def reset():
	for port in ports: 
   		grovepi.digitalWrite(port,0)
		time.sleep(0.1)

def init():
	global started
	global client
	lcd.setRGB(0,0,0)
	lcd.setText("IOT-DEVICE \nSTARTING")

	client.on_connect = on_connect
	client.on_message = on_message
	client.connect_async(MQTT_BROKER, 1883, 60)
	client.loop_start()

	# INIT
	reset()
	client.publish("online", makeJsonObject(True))

	time.sleep(0.1)
	lcd.setRGB(100,100,100)
	lcd.setText("LOADING ... ")
	lcd.setText("")
	started=True

def makeJsonObject(value=None,port=None,type=None,read=False):
	item=json.dumps({"port":port, "type":type,"value":value,"read":read})
	return str(item)

def makeJsonObject_detection(value=None,image1=None,image2=None,read=False):
	item=json.dumps({"value":value, "image1":image1,"image2":image2, "read":read})
	return str(item)

def exit():
	client.publish("online", makeJsonObject(False))
	reset()
	

	lcd.setRGB(100,100,100)
	lcd.setText("IOT-DEVICE \nSTOPPING")
	time.sleep(0.1)
	lcd.setRGB(0,0,0)
	lcd.setText("")

	

def main():
	init()
	
	while True:
		time.sleep(0.1)
		data = raw_input("Code:")
		if data is not None:
			try:
				if data=='exit':
					exit()
					sys.exit(0)
				else:	
					parsed_json=json.loads(str(data))
					_type =parsed_json['type'] 
					_port=parsed_json['port']
					_read=parsed_json['read']

					if _type is not None and _port is not None and _read is not None:
						item=str(json.dumps(parsed_json))
						print(item)
						client.publish("message",item)
					else:
						throw('Not correct data')
			except Exception as error:
				print('Error:',error)


if __name__ == '__main__':

	try:	
		if len(sys.argv)>1:
			MQTT_BROKER=sys.argv[1]
		else:	
			input_text = raw_input("Ip of MQTT-broker: ")
			if input_text:
				MQTT_BROKER=input_text
			
		#executor = ProcessPoolExecutor(2)
		#loop = trollius.get_event_loop()
		#_main = trollius.async(loop.run_in_executor(executor, main))
		main()
	except (TypeError) as ex:
		error="Error: " + str(ex)
		#print(error)
	except (KeyboardInterrupt):
		exit()
		print("\nIOT is afgesloten\n")
		sys.exit(0)
	except (SystemExit):
		print("\nIOT is geforceert afgelosten\n")
