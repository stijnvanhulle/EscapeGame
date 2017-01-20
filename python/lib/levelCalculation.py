#!/usr/bin/env python

import pandas as pd
import numpy as np
import os
import decimal
import sys
import sklearn
import math
from sklearn.utils import shuffle
from sklearn import linear_model

def calculate(data, file):
	print('Loading calculate')
	print(data,file)

	if data is not None and file is not None:
		try:
			maxLevel=10
			
			df =pd.read_csv(file)
			df.sort_values('gameDataId', axis=0, ascending=True,inplace=True)

			df.head()


			#part2:
			sequence = ['gameDataId','gameDuration','level']
			df = df.reindex(columns=sequence)
			df.head()

			#part3:
			df.corr()

			#part4:
			#part5:
			dfrnd = shuffle(df,random_state=0)
			#dfTrain = dataset[0:1000]
			#dfTest = dataset[1000:]

			#dataset opsplitsen
			from sklearn.cross_validation import train_test_split
			from sklearn.cross_validation import ShuffleSplit


			features = dfrnd.ix[:,[0,1]].copy() #o tot en met 3
			targets = dfrnd.ix[:,[2]].copy() # 4

			X_train, X_test, Y_train, Y_test = train_test_split(features, targets, test_size=0.4, random_state=0)
			#training en validatie

			regr_ep = linear_model.LinearRegression()
			regr_ep.fit(X_train, Y_train)

			print(df)
			#testen van de rest van de dataset
			score=regr_ep.score(X_test, Y_test) #--> vrij dicht bij 1 -> vrij goede correlatie
			print(score)

			#test: regr_ep.predict([[4,120]])
			#part6:
			val=[]
			if len(data)>0:
				for x in data:
					if x['duration'] is not None and x['gameDataId'] is not None:
						item=regr_ep.predict([[x['gameDataId'],x['duration']]])
						if item<=maxLevel and item>0:
							rounded= math.ceil(item[0][0]*100)/100
							x['level']=int(rounded)
							print(x)

							val.append(x)
						else:
							print(item,'not ')

			print(val)
			obj={}
			obj['data']=val
			obj['score']=score

			return obj
		except Exception as e:
			print(e)
			obj={}
			obj['data']=None
			obj['score']=0
			return obj
		
		
		

	return None