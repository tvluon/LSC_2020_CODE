import sys
import os
import cv2
import json
import numpy as np
import pickle as pkl
import get_similarity
import argparse
from tqdm import tqdm
from utils import *
from shutil import copy2

sys.path.insert(0, '/home/dat/Dat/py-bottom-up-attention/')
from feature_extractor import * 

query_params = json.load(open('query_params.json','r'))
images_DB = '/home/dat/Dat/dataset/lifelog/images'

def pre_processing(sample_im_dir, sample_vec_dir):
	# if len([x for x in os.listdir(sample_vec_dir) if x.find('.npy')!=-1])==0:
	get_features_from_data(sample_im_dir, sample_vec_dir, export_type='vec',NUM_OBJECTS=5)
	if query_params['visualize'] == 1:
		files = os.listdir(sample_im_dir)
		vis_dir = sample_im_dir + '_visualize'
		for f in files:
			get_detection(os.path.join(sample_im_dir, f), vis_dir, NUM_OBJECTS=5)
	input("Press ENTER...")
	export_sample_pickle(sample_vec_dir)

def query_in_candidates(text_query):
	sample_im_dir = './sample_img'
	sample_vec_dir = './sample_emb'
	feature_vector_path = 'DB_LSC.pkl'
	print('Loading Database')
	t1 = time.time()
	feature_dict = get_feature_dict(feature_vector_path)
	print(f'Done: Loading Database after {time.time() - t1} seconds')
	while True:
		thres = float(input('Threshold:'))
		pre_processing(sample_im_dir, sample_vec_dir)
		query_vectors_path = os.path.join(sample_vec_dir, 'query_vectors.pkl')
		queries_dict = get_feature_dict(query_vectors_path)

		print('Querying candidate vectors')
		result, score = get_similarity.get_list_similar_images(queries_dict, feature_dict, threshold=thres)
			# 
		temp_result = []
		for k,v in result.items():
			temp_result += list(v)
		temp_result = list(set(temp_result))
		temp_result = [r[:r.rfind('_')] for r in temp_result]
		for x in temp_result:
			if os.path.isfile(os.path.join(images_DB, get_date(x), x+'.jpg')):
				copy2(os.path.join(images_DB, get_date(x), x+'.jpg'),sample_im_dir)
			else:
				copy2(os.path.join(images_DB, get_date(x), x+'.JPG'),sample_im_dir)
		input("Press ENTER...")
		
		
		final_result = []
		for key in os.listdir(sample_im_dir):
			print(key,get_date(key) is None)
			if get_date(key) is not None:
				candidates = json.load(open(f'/home/dat/Dat/SuperGlue/clef_sample/{get_date(key)}/round2_candidates.json','r'))
				candidates = {v[0]:k for k,v in candidates.items()}
				print(candidates[key])
				final_result += [x.strip('\n') for x in open(f'/home/dat/Dat/SuperGlue/clef_sample/{get_date(key)}/{candidates[key]}', 'r')]
		print(final_result)
		print(f"Complete querying. Continue with another query..")

if __name__=='__main__':
	query_in_candidates("ABC")
