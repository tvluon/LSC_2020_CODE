# import nltk
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('punkt')
import os
# from xml.etree import cElementTree as ET
# from transformers import LxmertTokenizer
# import spacy
# import re
# import calendar
import json

# lxmert_tokenizer = LxmertTokenizer.from_pretrained("unc-nlp/lxmert-base-uncased")
nlp = spacy.load("en_core_web_sm")


week2date_dict = {'saturday': ['2015-02-28','2016-08-20','2016-08-27','2018-05-05','2016-09-17',
                               '2016-09-10','2016-09-03','2018-05-19','2018-05-26','2016-10-01',
                               '2016-08-13','2016-09-24','2015-03-14','2015-03-07','2018-05-12'],
                  'thursday': ['2015-02-26','2016-08-11','2016-08-18','2018-05-03','2016-09-29',
                               '2015-03-19','2018-05-10','2018-05-17','2015-03-05','2016-08-25',
                               '2016-09-15','2018-05-31','2015-03-12','2016-09-22','2018-05-24',
                               '2016-09-01','2016-09-08'],
                  'friday':   ['2016-08-26','2016-08-19','2015-02-27','2018-05-04','2015-03-20',
                               '2016-09-16','2018-05-18','2018-05-11','2016-09-02','2016-08-12',
                               '2016-09-23','2015-03-13','2016-09-09','2015-03-06','2018-05-25',
                               '2016-09-30'],
                  'sunday':   ['2016-08-21','2016-08-28','2016-09-11','2016-09-18','2016-09-04',
                               '2018-05-27','2018-05-20','2016-08-14','2015-03-15','2016-09-25',
                               '2018-05-06','2015-03-08','2018-05-13','2015-03-01','2016-10-02'],
                  'wednesday':['2016-08-17','2016-08-10','2015-03-18','2015-03-11','2016-09-21',
                               '2016-09-28','2015-03-04','2018-05-16','2015-02-25','2016-08-24',
                               '2018-05-09','2016-09-14','2018-05-30','2018-05-23','2016-09-07',
                               '2016-10-05','2016-08-31'],
                  'tuesday':  ['2016-08-16','2016-09-20','2016-09-27','2015-03-10','2015-03-17',
                               '2015-03-03','2018-05-29','2016-08-23','2015-02-24','2016-09-13',
                               '2018-05-08','2018-05-15','2018-05-22','2016-09-06','2016-10-04',
                               '2016-08-30','2016-08-09'],
                  'monday':   ['2016-08-29','2015-03-16','2016-09-26','2016-09-19','2016-09-05',
                               '2018-05-28','2015-03-02','2018-05-21','2016-08-22','2016-08-15',
                               '2015-02-23','2016-09-12','2018-05-07','2015-03-09','2018-05-14',
                               '2016-08-08','2016-10-03']}

month2date_dict = {calendar.month_name[2].lower() :['2015-02-{}'.format(x) for x in range(25,29)],
                   calendar.month_name[3].lower() :['2015-03-{}'.format(x) for x in range(10,21)]+ \
                                                   ['2015-03-0{}'.format(x) for x in range(1,10)],
                   
                   calendar.month_name[8].lower() :['2016-08-{}'.format(x) for x in range(10,32)]+ \
                                                   ['2016-08-0{}'.format(x) for x in range(8,10)], 
                   calendar.month_name[9].lower() :['2016-09-{}'.format(x) for x in range(10,31)]+ \
                                                   ['2016-09-0{}'.format(x) for x in range(1,10)],
                   calendar.month_name[10].lower():['2016-10-0{}'.format(x) for x in range(1,6)],
                   
                   calendar.month_name[5].lower() :['2018-05-{}'.format(x) for x in range(10,32)]+ \
                                                   ['2018-05-0{}'.format(x) for x in range(3,10)]}
year2date_dict = {'2015':month2date_dict[calendar.month_name[2].lower()] + \
                          month2date_dict[calendar.month_name[3].lower()],
                   '2016':month2date_dict[calendar.month_name[8].lower()] + \
                          month2date_dict[calendar.month_name[9].lower()] + \
                          month2date_dict[calendar.month_name[10].lower()],
                   '2018': month2date_dict[calendar.month_name[5].lower()]}


time2time_dict = {'breakfast': '04:00 - 11:59', 
                  'morning'  : '04:00 - 11:59',
                  'noon'     : '11:00 - 13:00', 
                  'afternoon': '12:00 - 16:59',
                  'evening'  : '17:00 - 22:59',
                  'dinner'   : '17:00 - 22:59',
                  'night'    : '23:00 - 03:59'}


with open('objects_vocab.json') as json_file: 
    obj_dict = json.load(json_file) 
    
with open('attributes_vocab.json') as json_file: 
    attr_dict = json.load(json_file) 

with open('places_vocab.json') as json_file: 
    place_dict = json.load(json_file) 

raw_metadata_list = [x.strip() for x in open('metadata_vocab.txt').readlines()]

obj_pattern = r'\b'+r'\b|\b'.join(list(obj_dict.keys()))+r'\b'
attr_pattern = r'\b'+r'\b|\b'.join(list(attr_dict.keys()))+r'\b'
place_pattern = r'\b'+r'\b|\b'.join(list(place_dict.keys()))+r'\b'
week_pattern = r'\b'+r'\b|\b'.join(list(week2date_dict.keys()))+r'\b'
month_pattern = r'\b'+r'\b|\b'.join(list(month2date_dict.keys()))+r'\b'
year_pattern = r'\b'+r'\b|\b'.join(list(year2date_dict.keys()))+r'\b'
time_pattern = r'\b'+r'\b|\b'.join(list(time2time_dict.keys()))+r'\b'

metadata_list = []

for metadata in raw_metadata_list:
    if metadata not in ['it','the','there','after','before','my'] and \
       metadata not in list(obj_dict.keys()) and \
       metadata not in list(attr_dict.keys()) and \
       metadata not in list(week2date_dict.keys()) and \
       metadata not in list(month2date_dict.keys()) and \
       metadata not in list(time2time_dict.keys()) and len(metadata)>0:
        metadata_list.append(metadata)
    
metadata_patern = r'[A-Z][a-z]+'
metadata_patern_1 = r'\b'+r'\b|\b'.join(metadata_list)+r'\b'

def token(ch):
    sentence = ch.strip().lower()
    obj_res = []
    raw_obj_res = list(set(re.findall(obj_pattern,sentence)))
    obj_res = [obj_dict[x] for x in raw_obj_res]

    attr_res = []
    raw_attr_res = list(set(re.findall(attr_pattern,sentence)))
    attr_res = [attr_dict[x] for x in raw_attr_res]
    
    place_res = []
    raw_place_res = list(set(re.findall(place_pattern,sentence)))
    for place in raw_place_res:
        place_res += place_dict[place]
    
    time_res = []
    if len(re.findall(time_pattern,sentence)) > 0:
        time_res = time2time_dict[re.findall(time_pattern,sentence)[0]]
        
    date_res = []
    if len(re.findall(week_pattern,sentence)) > 0:
        temp = re.findall(week_pattern,sentence)
        for item in temp:
            date_res += week2date_dict[item]
        
    if len(re.findall(month_pattern,sentence)) > 0:
        month_res = month2date_dict[re.findall(month_pattern,sentence)[0]]
        if len(date_res) > 0:
            date_res = list(set(date_res).intersection(set(month_res)))
        else:
            date_res = month_res
    if len(re.findall(year_pattern,sentence)) > 0:
        year_res = year2date_dict[re.findall(year_pattern,sentence)[0]]
        if len(date_res) > 0:
            date_res = list(set(date_res).intersection(set(year_res)))
        else:
            date_res = year_res
            
    raw_metadata_res = ' '.join([x.lower() for x in list(set(re.findall(metadata_patern,ch)))])
    metadata_res =list(set(re.findall(metadata_patern_1,raw_metadata_res)))
    other_info = {'DATE':[],'TIME':[],'PLACE':place_res}
    
    
    doc = nlp(ch.strip())
    for ent in doc.ents:
#         if ent.label_ not in ['PERSON','DATE','TIME']:
#             metadata_res.append(ent.text)
        if ent.label_ == 'DATE':
            other_info['DATE'].append(ent.text)
        if ent.label_ == 'TIME':
            other_info['TIME'].append(ent.text)
    
    
    return {'objects': obj_res,'atrributes':attr_res,
            'time': time_res,'date':date_res,'metadata':metadata_res,
            'others': other_info }