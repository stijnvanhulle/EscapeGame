#!/usr/bin/env python

import time
import datetime
import math
import sys
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
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
	client.subscribe("detection")

def on_message(client, userdata, msg):
	try:
		if msg.topic=="detection":
			
			parsed_json=json.loads(convertJson(msg.payload))
			_image1 =parsed_json['image1']
			_image2 =parsed_json['image2']
			_read=parsed_json['read']
			if _read:
				if _image1 is not None  and _image2 is not None:
					percent=faceDetection.getDifference(_image1,_image2)
					print('Detection:' + percent)
					client.publish("detection", makeJsonObject_detection(percent))		
	except Exception as error:
			print('Error:',error)

		
			
			
def convertJson(data):
	data=data.decode()

	if data.startswith("'") and data.endswith("'"):
		data = data[1:-1]
		print(data)
	return data


def init():
	client.on_connect = on_connect
	client.on_message = on_message
	client.connect_async(MQTT_BROKER, 1883, 60)
	client.loop_start()
	time.sleep(0.2)
	client.publish("online", makeJsonObject(True))

def makeJsonObject(value=None,port=None,type=None,read=False):
	item=json.dumps({"port":port, "type":type,"value":value,"read":read})
	return str(item)

def makeJsonObject_detection(value=None,image1=None,image2=None,read=False):
	item=json.dumps({"value":value, "image1":image1,"image2":image2, "read":read})
	return str(item)

def exit():
	client.publish("online", makeJsonObject(False))

	

def main():
	init()
	
	while True:
		time.sleep(0.1)
		data = input("Code:")
		if data is not None:
			try:
				if data=='exit':
					exit()
					sys.exit(0)
				else:	
					parsed_json=json.loads(convertJson(msg.payload))
					_type =parsed_json['type'] 
					_port=parsed_json['port']
					_read=parsed_json['read']

					if _type is not None and _port is not None and _read is not None:
						item=str(json.dumps(parsed_json))
						print(item)
						#client.publish("message",item)
						client.publish("detection",item)
					else:
						throw('Not correct data')
			except Exception as error:
				print('Error:',error)


if __name__ == '__main__':

	try:	
		if len(sys.argv)>1:
			MQTT_BROKER=sys.argv[1]
		else:	
			input_text = input("Ip of MQTT-broker: ")
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
