# @Author: Stijn Van Hulle <stijnvanhulle>
# @Date:   2016-11-28T13:51:38+01:00
# @Email:  me@stijnvanhulle.be
# @Last modified by:   stijnvanhulle
# @Last modified time: 2016-12-20T14:52:41+01:00
# @License: stijnvanhulle.be



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
isCode=None
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

def isBoolean(str):
	try:
		return type(str) == type(True) or type(str) == type(False)
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
def checkValueOfSensor(value):
	try:
		if value:
			value=float(value)
			if value<6000:
				return value
	except Exception as error:
		return -1
	return -1

def sendToMessage(_port,_type="INPUT",_connectorType="DIGITAL",_isReading=False):
	try:
		_port=int(_port)
		sensor_value=0
		pinMode(_port,_type)


		if str(_connectorType).lower()=="digital":
			[temp,hum] = dht(_port,0)
			if float(temp) and float(hum):
				sensor_value=str(json.dumps({"temperature":temp,"humidity":hum}))
			else:
				sensor_value = digitalRead(_port)
		elif str(_connectorType).lower()=="analog":
			sensor_value = analogRead(_port)
		else:
			return

		if checkValueOfSensor(sensor_value)!=-1:
			#isReading=True
			sensor_value=checkValueOfSensor(sensor_value)

		client.publish("message", makeJsonObject(sensor_value,_port,_type,False,True))
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
	client.subscribe("reset")

def on_message(client, userdata, msg):


	if msg.topic=="online":
		parsed_json=json.loads(convertJson(msg.payload))

	if msg.topic=="reset":
		print("reset")
		reset()


	if msg.topic=="message":
		parsed_json=json.loads(convertJson(msg.payload))
		_type =parsed_json['type'] if 'type' in parsed_json else None
		_port=parsed_json['port'] if 'port' in parsed_json else None
		_read=parsed_json['read'] if 'read' in parsed_json else None
		if _read==True:
			_realtime=parsed_json['realtime'] if 'realtime' in parsed_json else None
			_timeout=parsed_json['timeout'] if 'timeout' in parsed_json else None
			_connectorType=parsed_json["connectorType"] if 'connectorType' in parsed_json else None
			if _type is not None  and _port is not None and _connectorType is not None:
				sendToMessage(_port,_type,_connectorType)

#append or remove data
			if _realtime:
				addRealtimeData({"port":_port, "type": str(_type),"value":None,"connectorType":_connectorType,"timeout":_timeout})
			else:
				removeRealtimeData(_port)


		else:
			_value=parsed_json['value'] if 'value' in parsed_json else None
			_isReading=parsed_json['isReading'] if 'isReading' in parsed_json else None
			_connectorType= parsed_json["connectorType"] if 'connectorType' in parsed_json else None

			if _type is not None and _value is not None and _port is not None and _read is not None:

				if isFloat(_port):
					if _isReading==False or _isReading is None:
						removeRealtimeData(_port)

					if isBoolean(_value)==True:
						if _value==True or _value==False:
							pinMode(_port,_type)

						if _value==True:
							if str(_connectorType).lower()=="digital":
								digitalWrite(_port,1)
							elif str(_connectorType).lower()=="analog":
								analogWrite(_port,1)

							print('Port '+ str(_port) + ' is on')

						elif _value==False:
							if str(_connectorType).lower()=="digital":
								digitalWrite(_port,0)
							elif str(_connectorType).lower()=="analog":
								analogWrite(_port,0)

							print('Port '+ str(_port) + ' is off')

					else:
						print('no boolean')
						addRealtimeData({"port":_port, "type": str(_type),"value":str(_value),"connectorType":_connectorType,"timeout":None})



				elif str(_port)=="I2C-1" or str(_port)=="I2C-2" or str(_port)=="I2C-3":
						print('Text to display: '+ str(_value))
						lcd.setText(str(_value))
						sleep(0.1)
				else:
					#append or remove data
					addRealtimeData({"port":_port, "type": str(_type),"value":str(_value),"connectorType":_connectorType,"timeout":None})




def reset():
	global realtimeData

	for port in ports:
		digitalWrite(port,0)
		sleep(0.1)

	realtimeData=[]
	isReading=False
	lcd.setText("")

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
	client.publish("online", makeJsonOnlineObject('Box'))

	sleep(0.1)
	lcd.setRGB(100,100,100)
	lcd.setText("LOADING ... ")
	lcd.setText("")
	started=True


def makeJsonOnlineObject(device=''):
	item=json.dumps({"device":device})
	return str(item)

def makeJsonObject(value=None,port=None,type=None,read=False,isReading=None):
	item=json.dumps({"port":port, "type":type,"value":value,"read":read,"isReading":isReading})
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
					_port=item['port'] if 'port' in item else None
					_type=item['type'] if 'type' in item else None
					_timeout=item['timeout'] if 'timeout' in item else None
					_value=item['value'] if 'value' in item else None
					_connectorType=item["connectorType"] if 'connectorType' in item else None
					if _port is not None and _type is not None and _connectorType is not None:
						print(_value)
						if _value is not None or isBoolean(_value)==False:
							print('start morse')
							led.startMorse(str(_value),_port)
						else:
							sendToMessage(_port,_type,_connectorType,True)
							sleep(0.1)
						if _timeout is not None:
							sleep(_timeout)

	except Exception as error:
		print('Error REALTIME:',error)




def main():
	global isCode
	if isCode is not None:
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
						_type =parsed_json['type'] if 'type' in parsed_json else None
						_port=parsed_json['port'] if 'port' in parsed_json else None
						_read=parsed_json['read'] if 'read' in parsed_json else None
						_connectorType=parsed_json['connectorType'] if 'connectorType' in parsed_json else None

						if _type is not None and _port is not None and _read is not None:
							item=str(json.dumps(parsed_json))
							print(item)
							client.publish("message",item)
						else:
							throw('Not correct data')
				except Exception as error:
					print('Error:',error)


if __name__ == '__main__':
	global isCode
	isCode=None

	try:
		if len(sys.argv)>1:
			MQTT_BROKER=sys.argv[1]
			if len(sys.argv)>2:
				isCode=sys.argv[2]
				if str(isCode).lower()=="yes":
					isCode=True
				else:
					isCode=False
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
