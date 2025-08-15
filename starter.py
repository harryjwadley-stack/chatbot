
import pandas as pd

class starterClass:

    def __init__(self, starter):
        
        self.starter=starter

    def starter_module(self, txt):
        
        print(txt)
        print()

        return
        
    def run_all(self):
        
        if self.starter:
        
            print('running all')
            print()

            self.starter_module('running \'starter_module\'')

            print('fin all')
            print()
        
        else: 

            print(None)

        return

def main():
    
    extractor = starterClass(starter=True)
    extractor.run_all()

if __name__ == '__main__':

    main()
