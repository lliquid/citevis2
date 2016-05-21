import json
import networkx as nx
from networkx.readwrite import json_graph



def main():
	data = None
	with open('citations-all-conf.json', 'r') as f:
		data = json.load(f)
	data.append({'papers': [], 'year': 2015})
	data[-1]['papers'].append({'conference': 'InfoVis', 'papers': []})
	data[-1]['papers'].append({'conference': 'SciVis', 'papers': []})
	data[-1]['papers'].append({'conference': 'VAST', 'papers': []})
	with open('IEEE VIS papers 1990-2015 - Main dataset.tsv', 'r') as f:
		f.readline()
		for l in f:
			strs = l.split('\t')
			year = int(strs[1])
			if year == 2015:
				conf = strs[0]
				title = strs[2]
				id = strs[7]
				authors = [a.decode('latin1') for a in strs[15].split(';')]
				citations = strs[16].split(';')
				dd = list(filter(lambda d: d['conference'] == conf, data[-1]['papers']))[0]
				dd['papers'].append({
					'id': id,
					'conference': conf,
					'doi': '',
					'gid': '',
					'gscholar': '',
					'title': title,
					'year': year,
					'authors': authors,
					'citations': [{'loc': '', 'id': c} for c in citations if len(c) > 4],
					'concepts': [],
					'keywordstr': ''.join(title.split(' ')).lower()
					})




		
	with open('citations-all-conf-add-2015.json', 'w') as f:
		json.dump(data, f)


if __name__ == '__main__':
	main()


