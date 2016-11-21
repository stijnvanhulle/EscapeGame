from time import sleep, time
from grovepi import *
import grove_rgb_lcd as lcd
import json

stop=False

morseMap=[
{"item": "A","value": ".-" },
  {"item":"B" ,"value": "-..." },
  {"item": "C","value": "-.-." },
  {"item": "D","value": "-.." },
  {"item": "E","value": "." },
  {"item": "F","value": "..-." },
  {"item": "G","value": "--." },
  {"item": "H","value": "...." },
  {"item": "I","value": ".." },
  {"item": "J","value": ".---" },
  {"item": "K","value": ".-.-" },
  {"item": "L","value": ".-.." },
  {"item": "M","value": "--" },
  {"item": "N","value": "-." },
  {"item": "O","value": "---" },
  {"item": "P","value": ".--." },
  {"item": "Q","value": "--.-" },
  {"item": "R","value": ".-." },
  {"item": "S","value": "..." },
  {"item": "T","value": "-" },
  {"item": "U","value": "..-" },
  {"item": "V","value": "...-" },
  {"item": "W","value": ".--" },
  {"item": "X","value": "-..-" },
  {"item": "Y","value": "-.--" },
  {"item": "Z","value": "--.." },
  {"item": " ","value": "     " },
	
  {"item":"1","value": ".----" },
  {"item":"2","value": "..---" },
  {"item":"3","value": "...--" },
  {"item":"4","value": "....-" },
  {"item":"5","value": "....." },
  {"item":"6","value": "-...." },
  {"item":"7","value": "--..." },
  {"item":"8","value": "---.." },
  {"item":"9","value": "----." },
  {"item":"0","value": "-----" }
]

def dot(led, UNIT_length):
	digitalWrite(led,1) 
	sleep(UNIT_length)
	digitalWrite(led,0)    
	sleep(UNIT_length)                     

def dah(led, UNIT_length):
	digitalWrite(led,1) 
	sleep(UNIT_length * 3)
	digitalWrite(led,0)    
	sleep(UNIT_length)       

def gap(led, UNIT_length):
	digitalWrite(led,0) 
	sleep(UNIT_length)


def encode(word):
	text=""
	for i in range(len(word)):
		letter=word[i:i+1]

		for item in morseMap:
			if item:
			 	_item=item["item"]
			 	_value=item["value"]
			 	if _item==letter:
			 		text+=_value + " "
	return text

def startMorse(text="",led=4,UNIT_length=0.300):
	pinMode(led,"OUTPUT")
	global stop
	stop=False
	text=text.upper()

	#while stop is False:
	try:
		morseWord=encode(text)
		print(morseWord)
		for i in range(len(morseWord)):
			if str(morseWord[i])=='.':
				dot(led,UNIT_length)
			elif str(morseWord[i])=='-':
				dah(led,UNIT_length)
			else:
				gap(led,UNIT_length)

           
		sleep(1)
	except IOError:                             # Print "Error" if communication error encountered
		print ("Error")

def stopMorse():
	global stop
	stop=True