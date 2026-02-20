import json
import os
import openpyxl

def main():
    os.makedirs('lib/rto-data', exist_ok=True)
    
    # 1. Parse Consolidated Exclusion List
    with open('public/RTO data/Consolidated Exclusion List.txt', 'r') as f:
        content = f.read().strip()
        # Split by comma and clean
        exclusion_pincodes = [code.strip() for code in content.split(',') if code.strip()]
        
    with open('lib/rto-data/exclusion-list.json', 'w') as f:
        json.dump(exclusion_pincodes, f)
        
    print(f"Parsed {len(exclusion_pincodes)} pincodes from Exclusion List.")

    # 2. Parse Roposo Excel list
    wb = openpyxl.load_workbook('public/RTO data/Roposo-high-rto-pincode-list.xlsx')
    sheet = wb.active
    
    roposo_pincodes = []
    # Assuming the first row might be header: "Pincode", "District", "StateName"
    for row in sheet.iter_rows(min_row=2, values_only=True):
        if len(row) >= 2:
            pincode = row[1]
            if pincode:
                # convert to string and handle formatting if it's treated as float
                try:
                    pstr = str(int(pincode)).strip()
                    if len(pstr) == 6:
                        roposo_pincodes.append(pstr)
                except (ValueError, TypeError):
                    pass
    
    # remove duplicates
    roposo_pincodes = list(set(roposo_pincodes))
    
    with open('lib/rto-data/roposo-risk.json', 'w') as f:
        json.dump(roposo_pincodes, f)
        
    print(f"Parsed {len(roposo_pincodes)} unique pincodes from Roposo List.")

if __name__ == "__main__":
    main()
