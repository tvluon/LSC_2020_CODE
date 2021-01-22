import pickle as pkl
import faiss
import os
import numpy as np
import time

def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0:
        return v
    return v / norm

def get_feature_dict(pickle_file):
    f = open(pickle_file,'rb')
    D = pkl.load(f, encoding='latin')
    for k, v in D.items():
        D[k] = normalize(v)
    return D

def get_list_similar_images(queries_dict, feature_dict, threshold=0.9):
    db_list_id = []
    # load vector -> database
    db = []
    for obj_id in feature_dict:
        db.append(feature_dict[obj_id])
        db_list_id.append(obj_id)

    db = np.array(db)
    db = db.astype('float32')

    t1 = time.time()
    db_list_id = np.array(db_list_id)
    q = []
    for sample in queries_dict:
        q.append(queries_dict[sample])

    q = np.array(q)
    q = q.astype('float32')
    res = faiss.StandardGpuResources()

    index_cat = faiss.IndexFlatIP(2048)
    gpu_index_cat = faiss.index_cpu_to_gpu(res, 0, index_cat)
    gpu_index_cat.add(db)
    D, I = gpu_index_cat.search(q, 128)

    print('Done: Searching')
    pos = D >= threshold
    dict_result = {}

    for i, path in enumerate(queries_dict):
        dict_result[path] = db_list_id[I[i][pos[i]]]
    print('Search time:', time.time()-t1)
    return dict_result, D[pos]
    