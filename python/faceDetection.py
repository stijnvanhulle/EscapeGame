#!/usr/bin/env python

import cv2
from matplotlib import pyplot as plt
import numpy as np


def getDifference(image1,image2:

	sift = cv2.xfeatures2d.SIFT_create()
	surf = cv2.xfeatures2d.SURF_create()
	orb = cv2.ORB_create()

	img1 = cv2.imread(image1,0)        # queryImage
	img2 = cv2.imread(image2,0) 		# trainImage


	# find the keypoints and descriptors with SIFT
	kp1, des1 = sift.detectAndCompute(img1,None)
	kp2, des2 = sift.detectAndCompute(img2,None)

	# BFMatcher with default params
	bf = cv2.BFMatcher()
	matches = bf.knnMatch(des1,des2, k=2)

	# Apply ratio test
	good = []
	for m,n in matches:
	    if m.distance < 0.25*n.distance:
	        good.append([m])

	amount=len(good)      
	percent=amount/len(matches)
	print(percent *100)
	# cv2.drawMatchesKnn expects list of lists as matches.
	img3 = cv2.drawMatchesKnn(img1,kp1,img2,kp2,good,None,flags=2)
	plt.imshow(img3)
	plt.show()

	return percent * 100