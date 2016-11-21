#!/usr/bin/env python

from time import sleep, time
import datetime
import math
import sys
import trollius
import json
from trollius import From
import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
from grovepi import *
import grove_rgb_lcd as lcd
from concurrent.futures import ProcessPoolExecutor
from threading import Timer
from apscheduler.schedulers.background import BackgroundScheduler
import led as led

scheduler = BackgroundScheduler()
scheduler.start()

# CONNECTORS

#moisure=0

display_status=""

# PINMODES
#INPUT


#OUTPUT
#pinMode(relay,"OUTPUT")

#variables
realtimeData=[]
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

def convertJson(data):
	data=data.decode()

	if data.startswith("'") and data.endswith("'"):
		data = data[1:-1]
		print(data)
	return data

def timeout(job_fn, *fn_args, **delta_args):
    time = datetime.datetime.now() + datetime.timedelta(**delta_args)
    return sched.add_job(job_fn, fn_args,time)

def sendToMessage(_port,_type="INPUT"):
	try:
		_port=int(_port)
		sensor_value=0
		pinMode(_port,_type)

		sensor_value = analogRead(_port)
		if sensor_value is None:
			sensor_value = digitalRead(_port)
			isDigital=True

		if sensor_value:
			
			client.publish("message", makeJsonObject(sensor_value,_port,_type))
			print('Port ' + str(_port) + ' ' + str(sensor_value))
	except Exception as error:
		print('Error:',error)

def addRealtimeData(obj):
	global realtimeData
	exist=False
	port=obj['port']
	data=[]

	for item in realtimeData:
		if item["port"]==port:
			item=obj
			exist=True
		data.append(item)
	

	if exist:
		realtimeData=data
	else:
		realtimeData.append(obj)

	return realtimeData

def removeRealtimeData(port):
	global realtimeData

	data=[]
	for item in realtimeData:
		if item["port"]!=port:
			data.append(item)
	realtimeData=data

	return realtimeData

def on_connect(client, userdata, rc):
	print("Connected to MQTT-broker on " + MQTT_BROKER )
	client.subscribe("online")
	client.subscribe("message")
	client.subscribe("detection")

def on_message(client, userdata, msg):
	

	if msg.topic=="online":
		parsed_json=json.loads(convertJson(msg.payload))
		

	if msg.topic=="message":
		parsed_json=json.loads(convertJson(msg.payload))
		_type =parsed_json['type']
		_port=parsed_json['port']
		_read=parsed_json['read']
		if _read:
			_realtime=parsed_json['realtime']
			_timeout=parsed_json['timeout']
			if _type is not None  and _port is not None:

				sendToMessage(_port,_type)

#append or remove data
			if _realtime:
				addRealtimeData({"port":_port, "type": str(_type),"value":None,"timeout":_timeout})
			else:
				removeRealtimeData(_port)
				
						
		else:
			_value=parsed_json['value']
			if _type is not None and _value is not None and _port is not None and _read is not None:
				if isFloat(_value)==False:
					if str(_port)=="I2C-1" or str(_port)=="I2C-2" or str(_port)=="I2C-3":
						print('Text to display: '+ str(_value))
						lcd.setText(str(_value))
					else:
						#append or remove data
						addRealtimeData({"port":_port, "type": str(_type),"value":str(_value),"timeout":None})
				elif isFloat(_port):
					pinMode(_port,_type)
					if _value==True:
						digitalWrite(_port,1)
						print('Port '+ str(_port) + ' is on')

					elif _value==False:
						digitalWrite(_port,0)
						print('Port '+ str(_port) + ' is off')
			
			


def reset():
	for port in ports: 
		digitalWrite(port,0)
		sleep(0.1)

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

	sleep(0.1)
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
	sleep(0.1)
	lcd.setRGB(0,0,0)
	lcd.setText("")

def realtime():
	try:
		global realtimeData
		if len(realtimeData)>0:
			for item in realtimeData:
				if item:
					_port=item['port']
					_type=item['type']
					_timeout=item['timeout']
					_value=item['value']
					if _port is not None and _type is not None:
						if _value is not None:
							led.startMorse(str(_value),_port)
						else:
							sendToMessage(_port,_type)
							sleep(0.1)

	except Exception as error:
		print('Error REALTIME:',error)
		

	

def main():
	isCode=False
	data=str(raw_input("Use code (yes or no)"))
	if data=="yes":
		isCode=True
	init()
	sleep(0.1)
	while True:
		realtime()
		if isCode:
			data = str(raw_input("Code:"))
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
			input_text = str(raw_input("Ip of MQTT-broker: "))
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
