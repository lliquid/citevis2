import csv

folder = "cites/"

# filenames = {}
filenames = []


i=0
with open('spreadsheet.txt','r') as spreadsheet:
  reader = csv.DictReader(spreadsheet, delimiter='\t')
  for row in reader:
    if row["Panel, Keynote, Captstone, Demo, Poster"] not in ["x","X"]:
      fa = row["Author Names"].split(';')[0].split(',')[0].strip().lower()
      fa_split = fa.split(' ')
      if len(fa_split) > 1:
        if fa_split[0] in ['van','von','de']:
          fa = "".join(fa_split)
        else:
          fa = fa_split[-1]

      if len(row["CiteFNAuthorKey"])>0:
        fa = row["CiteFNAuthorKey"]


      year = row["Year"].strip()
      conf = row["Conference"].strip()
      if conf == "SciVis":
        conf = 'vis'
      else:
        conf = conf.lower()
      fn = fa + "_" + conf + "_" + year[2:4] +".txt"
      try:
        open(folder+fn)
        # filenames[row["Paper Title"]] = fn
        filenames.append(fn)
      except:
        try:
          fa_short = fa[:8]
          fn_short = fa_short + "_" + conf + "_" + year[2:4] +".txt"
          # print fn_short
          open(folder+fn_short)
          # filenames[row["Paper Title"]] = fn_short
          filenames.append(fn_short)
        except:
          print fn+'\t'+row['Paper Title']
          i+=1
    else:
      filenames.append('')

print "Failures:",
print i


# filenames.sort()

for fn in filenames:
  print fn

# with open('spreadsheet.txt') as spreadsheet:
#   reader = csv.reader(spreadsheet, delimiter='\t')
#   headers = True
#   for row in reader:
#     if headers:
#       headers = False
#       continue
#     row.append(filenames[row[3]])
#     print '\t'.join(row)



