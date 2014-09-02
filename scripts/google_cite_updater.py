from collections import defaultdict
import re
import json
import time
import urllib2
from bs4 import BeautifulSoup

USER_AGENT = 'Mozilla/5.0 (X11; U; FreeBSD i386; en-US; rv:1.9.2.9) Gecko/20100913 Firefox/3.6.9'

year_re = re.compile(r'infovis(.*?)--.*')
gcite_re = re.compile(r'(\d+) result')

# leo = open('../data/infovis-citation-data.txt','rb')
leo = open('../data/citevis-data-with-ids.txt','rb')
# leo = open('../data/test.txt','rb')

years = defaultdict(list)

paper = {}
leo = leo.readlines()
i = -1
while i<len(leo)-1:
  i+=1
  line = leo[i].strip()
  if line=="":
    print line
  if line.startswith("article"):
    time.sleep(1)
    print line # article
    i+=1
    line = leo[i].strip()
    print line # jig_id
    i+=1
    line = leo[i].strip()
    print line # doi
    i+=1
    line = leo[i].strip()
    gid = line
    print line # gid
    url = "http://scholar.google.com/scholar?cluster="
    url+=gid
    req = urllib2.Request(url=url,headers={'User-Agent': USER_AGENT})
    # print urllib2.urlopen(req)
    soup = BeautifulSoup(urllib2.urlopen(req))
    valdiv = soup.find(id="gs_ab_md")
    valdiv = gcite_re.search(str(valdiv)).group(1)
    print valdiv
    # print soup

    i+=1
    line = leo[i].strip()
    print line # gscholar
    i+=1
    line = leo[i].strip()
    print line # title
    continue

  if line.startswith('concept: '):
    print line
    continue

  if line.startswith('indexterm: '):
    print line
    continue

  if line.startswith('author: '):
    print line
    continue

  if line.startswith('keyword: '):
    print line
    continue

  if line=='citations:':
    i+=1
    line = leo[i].strip()
    print line
    while line!='':
      # print line
      i+=1
      line = leo[i].strip()
      print line
      i+=1
      line = leo[i].strip()
      print line 
    continue

