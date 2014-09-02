import json

csv = open('../data/citations.csv','r')
outfile = open('../data/citations.json','w')
mode = 'node'
nodes = {}
edges = []
for line in csv:
  line = line.strip()
  if line == 'xxxx':
    mode = 'edge'
    continue
  if line.strip() == '':
    continue
  if mode == 'node':
    line = line.split(',')
    node = {}
    node['id']=line[0]
    node['year'] = line[1]
    node['cites'] = line[2]
    node['innodes'] = []
    node['outnodes'] = []
    nodes[node['id']] = node
  if mode == 'edge':
    line = line.split(',')
    edge = {}
    edge['source'] = line[0]
    edge['target'] = line[1]
    edges.append(edge)

for e in edges:
  s = nodes[e['source']]
  t = nodes[e['target']]
  s['outnodes'].append(t['id'])
  t['innodes'].append(s['id'])


outfile.write( json.dumps(nodes.values(),indent=2) )

