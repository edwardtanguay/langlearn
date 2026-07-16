import re
import json

def parse_txt():
    with open('c:/edward/projects/apps/langlearn/data/fr-learnbits.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # We will just write a python dict to structure it, then dump to JSON
    # It might be simpler to write it by hand than write a parser for a one-off custom format.
