import csv
import json
from collections import defaultdict

years = defaultdict(lambda : defaultdict(list))

def confsort(a,b):
  order = ['SciVis','InfoVis','VAST']
  return order.index(a['conference']) - order.index(b['conference'])

with open('IEEE_VIS.tsv','r') as spreadsheet:
  reader = csv.DictReader(spreadsheet, delimiter='\t')
  for row in reader:
    if row["Panel, Keynote, Captstone, Demo, Poster"] not in ["x","X"]:
      paper = {}
      paper['id'] = row['IEEE XPLORE Article Number']
      paper['year'] = row['Year']
      paper['doi'] = row['Paper DOI']
      paper['gid'] = ''
      paper['gscholar'] = 0
      paper['authors'] = [x.strip() for x in row['Deduped author names'].split(';')]
      # paper['abstract'] = row['Abstract']
      paper['title'] = row['Paper Title']
      paper['keywordstr'] = ''.join(c.lower() for c in paper['title'] if (not c.isspace() and c.isalpha))
      paper['concepts'] = []
      paper['citations'] = [x.strip() for x in row['Citations'].split(';')]
      if '' in paper['citations']:
        paper['citations'] = []
      paper['conference'] = row['Conference']

      paper['citations'] = [{'id': x, 'loc':''} for x in paper['citations']]
      years[paper['year']][paper['conference']].append(paper)

newyears = defaultdict(list)

for year in years:
  for conf in years[year]:
    newyears[year].append({'conference':conf, 'papers':years[year][conf]})

for year in newyears:
  newyears[year].sort(confsort)


newyears = [{'year': k, 'papers': v} for k,v in newyears.iteritems()]
print json.dumps(newyears, sort_keys=True,
                  indent=2, separators=(',', ': '))
