# @Author: Stijn Van Hulle <stijnvanhulle>
# @Date:   2016-11-28T13:51:38+01:00
# @Email:  me@stijnvanhulle.be
# @Last modified by:   stijnvanhulle
# @Last modified time: 2016-12-20T12:51:07+01:00
# @License: stijnvanhulle.be



#!/usr/bin/env python

import time
import datetime
import math
import sys
import json
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import lib.faceDetection as faceDetection
import lib.levelCalculation as levelCalculation


MQTT_BROKER="localhost"
client = mqtt.Client()

#classes

def on_connect(client, userdata, rc):
	print("Connected to MQTT-broker on " + MQTT_BROKER )
	client.subscribe("online")
	client.subscribe("message")
	client.subscribe("detection_find")
	client.subscribe("detection_found")

	client.subscribe("recalculate_start")
	client.subscribe("recalculate_done")

def on_message(client, userdata, msg):
	try:
		parsed_json=json.loads(convertJson(msg.payload))


		if msg.topic=="detection_find":	
			print(parsed_json)
			_image1 =parsed_json['image1']
			_image2 =parsed_json['image2']
			_read=parsed_json['read']
			if _read:
				if _image1 is not None  and _image2 is not None:
					percent=faceDetection.getDifference(_image1,_image2)
					print('Detection:' + str(percent))
					client.publish("detection_found", makeJsonObject_detection(percent,_image1,_image2,_read))	

		if msg.topic=="recalculate_start":
			print(parsed_json)
			_data =parsed_json['data']
			_file=parsed_json['file']
			if _data is not None:
				calcObj=levelCalculation.calculate(_data,_file)
				print('CalculatedOBJ:' + str(calcObj))
				client.publish("recalculate_done", makeJsonObject_levelCalculate(calcObj['data'],calcObj['score']))		
	except Exception as error:
			print('Error:',error)




def convertJson(data):
	data=data.decode()

	if data.startswith("'") and data.endswith("'"):
		data = data[1:-1]
		print(data)
	return data
def makeJsonOnlineObject(device=''):
	item=json.dumps({"device":device})
	return str(item)

def init():
	client.on_connect = on_connect
	client.on_message = on_message
	client.connect_async(MQTT_BROKER, 1883, 60)
	client.loop_start()
	time.sleep(0.2)
	client.publish("online", makeJsonOnlineObject('FaceDetection'))

def makeJsonObject(value=None,port=None,type=None,read=False):
	item=json.dumps({"port":port, "type":type,"value":value,"read":read})
	return str(item)

def makeJsonObject_detection(value=None,image1=None,image2=None,read=False):
	item=json.dumps({"value":value, "image1":image1,"image2":image2, "read":read})
	return str(item)
	
def makeJsonObject_levelCalculate(data=None,score=0):
	item=json.dumps({"data":data,"score":score})
	return str(item)


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
