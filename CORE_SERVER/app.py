from flask import Flask
from flask import request
from query import *
from get_similarity import *
import pandas as pd
import shutil
import base64

app = Flask(__name__)

feature_dict = None

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/', methods=['GET', 'POST'])
def index():
    global feature_dict

    sample_img_dir = 'sample_im/'
    sample_vec_dir = 'sample_vec/'
    if os.path.exists(sample_img_dir):
        shutil.rmtree(sample_img_dir)
    if os.path.exists(sample_vec_dir):
        shutil.rmtree(sample_vec_dir)
    os.mkdir(sample_img_dir)
    os.mkdir(sample_vec_dir)

    samples = request.form.getlist('samples')

    for i, sample in enumerate(samples):
        if 'base64' in sample:
            data = sample.split(',')[1]
            info = sample.split(',')[0]
            ext = 'jpg'
            image = open(os.path.join(sample_img_dir, f'sample{i}.{ext}'), "wb")
            image.write(base64.b64decode(data))
            image.close()
        else:
            print('id sample')

    pre_processing_v2(sample_img_dir, sample_vec_dir)
    queries_dict = None
    try:
        query_vectors_path = os.path.join(sample_vec_dir, 'query_vectors.pkl')
        queries_dict = get_feature_dict(query_vectors_path)
    except:
        print('query_vectors.pkl not found!!!')
        return json.dumps([])

    query_in_candidates_v2('',feature_dict,queries_dict)

    f = open('query_result.txt')
    results = f.read().splitlines()
    f.close()
    return json.dumps(results)

def pre_processing_v2(sample_im_dir, sample_vec_dir):
    # if len([x for x in os.listdir(sample_vec_dir) if x.find('.npy')!=-1])==0:
    get_features_from_data(sample_im_dir, sample_vec_dir, export_type='vec',NUM_OBJECTS=5)
    if query_params['visualize'] == 1:
        files = os.listdir(sample_im_dir)
        vis_dir = sample_im_dir + '_visualize'
        for f in files:
            get_detection(os.path.join(sample_im_dir, f), vis_dir, NUM_OBJECTS=5)
    # input("Press ENTER...")
    export_sample_pickle(sample_vec_dir)

def query_in_candidates_v2(text_query,feature_dict,queries_dict):
    sample_im_dir = './sample_im'
    print('Querying candidate vectors')
    result, score = get_similarity.get_list_similar_images(queries_dict, feature_dict, 0.45)#, threshold=thres)
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
    
    final_result = []
    clusters = []

    for key in os.listdir(sample_im_dir):
        print(key,get_date(key) is None)
        if get_date(key) is not None:
            candidates = json.load(open(f'/home/dat/Dat/SuperGlue/clef_sample/{get_date(key)}/round2_candidates.json','r'))
            candidates = {v[0]:k for k,v in candidates.items()}
            try:
                print(candidates[key])
                final_result += [x.strip('\n') for x in open(f'/home/dat/Dat/SuperGlue/clef_sample/{get_date(key)}/{candidates[key]}', 'r')]
            except:
                print('Key error', key)
            
            clusters.append(key)
    print(clusters)
    print(f"Complete querying. Continue with another query..")

    f = open(f'query_result.txt','w')
    f.write('\n'.join([x.split('.')[0] for x in clusters]))
    f.close()

if __name__ == '__main__':
    feature_vector_path = 'DB_LSC.pkl'
    feature_dict = get_feature_dict(feature_vector_path)
    app.run(host='127.0.0.1', port='5000')
