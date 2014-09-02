from collections import defaultdict
import re
import json

year_re = re.compile(r'infovis(.*?)--.*')


# leo = open('../data/infovis-citation-data.txt','rb')
leo = open('../data/citevis-data-with-ids.txt','rb')

years = defaultdict(list)

paper = {}
leo = leo.readlines()
i = -1
while i<len(leo)-1:
  i+=1
  line = leo[i].strip()
  if line=="":
    continue
  if line.startswith("article"):
    if 'year' in paper:
      years[paper['year']].append(paper)
    paper = {}
    if line.endswith("best"):
      paper['best'] = True
    i+=1
    line = leo[i].strip()
    paper['id'] = line
    y = year_re.match(line).group(1)
    y = '19'+y if (y.startswith('9')) else '20'+y
    paper['year'] = y
    i+=1
    line = leo[i].strip()
    paper['doi'] = line
    i+=1
    line = leo[i].strip()
    paper['gid'] = line
    i+=1
    line = leo[i].strip()
    paper['gscholar'] = line
    i+=1
    line = leo[i].strip()
    paper['title'] = line
    paper['keywordstr'] = ''.join(c.lower() for c in line if (not c.isspace() and c.isalpha))
    paper['concepts'] = []
    paper['authors'] = []
    paper['citations'] = []
    continue

  if line.startswith('concept: '):
    c = line.split(': ')[1]
    paper['concepts'].append(c)
    continue

  if line.startswith('author: '):
    a = line.split(': ')[1]
    paper['authors'].append(a)
    continue

  if line=='citations:':
    i+=1
    line = leo[i].strip()
    while line!='':
      citation = {}
      citation['id'] = line
      i+=1
      line = leo[i].strip()
      citation['loc'] = line
      paper['citations'].append(citation)
      i+=1
      line = leo[i].strip()
    continue

newyears = [{'year': k, 'papers': v} for k,v in years.iteritems()]

print json.dumps(newyears, sort_keys=True,
                  indent=2, separators=(',', ': '))


