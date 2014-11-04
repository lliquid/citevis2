import os

for dirname, dirnames, filenames in os.walk('cites'):
  for fn in filenames:
    with open('cites/'+fn) as text:
      for line in text:
        if line.startswith('authors'):
          commas = line.split(',')
          words = commas[0].split(' ')
          correct = words[-1].lower().strip()
          fn_name = fn.split('_')[0].strip()
          if correct != fn_name:
            print fn_name + "\t"+ correct
