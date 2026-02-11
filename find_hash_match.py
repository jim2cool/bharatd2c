
import hashlib

def get_hash(string):
    return hashlib.sha512(string.encode()).hexdigest()

target_hash = "80c567465ad88fec76ba221a56ca45a1d3803ccf9de11ef69" # Partial from JS output

base_key = "OP6Zrk"
base_salt = "EGhPG2OjF6DiwfTTjZmpLiYgMAA4lmt6"
txnid = "TXN1770722045415ZQFBSZ1"
amount = "1499.00" 
productinfo = "Test"
firstname = "John"
email = "john@example.com"

# Variations to test
keys = [base_key, base_key + " ", " " + base_key, base_key + "\n"]
salts = [base_salt, base_salt + " ", " " + base_salt, base_salt +("\n")]

print(f"Target starts with: {target_hash[:10]}")

for k in keys:
    for s in salts:
        # PayU Formula
        # key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
        s_val = f"{k}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|||||||||||{s}"
        h = get_hash(s_val)
        if h.startswith(target_hash[:10]):
            print(f"MATCH FOUND!")
            print(f"Key: '{k}'")
            print(f"Salt: '{s}'")
            exit()

print("No simple whitespace match found.")
