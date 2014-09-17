import os
import re
import json
from collections import defaultdict

directory = 'vis_dataset'

# parsed.append((fn, re.findall(r'title:([^\n]+)\nauthors:([^\n]+)\nabstract:([^\n]+)\nvis citations:([^\Z]+)\Z', filestr)))

fn_json = 'vis_dataset_ii.json'

# papers = dict()
years = defaultdict(dict)

for fn in os.listdir(directory):
    with open(os.path.join(directory, fn), 'r') as f:
        paper = dict()
        raw_year =  int(fn.split('.')[0].split('_')[-1])
        conf = fn.split('.')[0].split('_')[1]
        year_val = 2000 + raw_year if raw_year < 50 else 1900 + raw_year
        year = years[str(year_val)]
        paper['id'] = fn.replace('.txt','')
        paper['year'] = year_val
        paper['conference'] = conf
        year[paper['id']] = paper
        paper['citations'] = []
        paper['concepts'] = []
        incitation = False
        for l in f:
            if l.startswith('title') or l.startswith('titel'):
                paper['title'] = l[6:].rstrip().lstrip()
                incitation = False
                continue
            if l.startswith('authors:') or l.startswith('autors') or l.startswith('auhors'):
                paper['authors'] = l[8:].strip()
                continue
            if l.startswith('abstract:'):
                paper['abstract']  = l[9:].strip()
                continue
            if l.startswith('vis citations:'):
                
                incitation = True
                continue
            if incitation:
                cite_obj = {}
                cite_obj['id'] = l.rstrip()
                cite_obj['loc'] = ''
                paper['citations'].append(cite_obj)
            else:
                paper['authors'] = ' '.join([paper['authors'], l.rstrip()])

        paper['authors'] =  [w.rstrip().lstrip() for w in paper['authors'].split(',')]

        # papers[fn.split('.')[0]] = paper
        paper['doi'] = ""
        paper['gscholar'] = "0"
        paper['keywordstr'] = paper['title'].replace(' ','').lower()

year_list = []

for year,year_dict in years.iteritems():
    year_obj = {}
    year_obj['year'] = int(year)
    # year_obj['papers_dict'] = year_dict
    paper_list = []
    for pid,paper in year_dict.iteritems():
        paper_list.append(paper)
    year_obj['papers'] = paper_list
    year_list.append(year_obj)

def sort_years(a,b):
    return a['year']-b['year']

year_list.sort(sort_years)



with open(fn_json, 'w') as f:
    json.dump(year_list, f, indent=2)

# papersStr =  json.dumps(papers,indent=2)



    # print papers


