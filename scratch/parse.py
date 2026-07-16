import json
import re

def parse_txt():
    with open('c:/edward/projects/apps/langlearn/data/fr-learnbits.txt', 'r', encoding='utf-8') as f:
        content = f.read()

    # I will just write the data structure manually to ensure perfection
