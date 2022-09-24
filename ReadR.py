import matplotlib.pyplot as plt
import json

input_file_path = 'ReadR/2022_8_24.json'

with open(input_file_path, 'r') as r:
    x = r.read()

parsed_data = json.loads(x)
y_list = []

for i in parsed_data:
    y_list.append(i['temp'])

plt.plot(y_list)

plt.show()


