
import hashlib

def generate_hash(key, txnid, amount, productinfo, firstname, email, salt):
    # PayU Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    # Note: 11 pipes after email if udf1-5 are empty
    
    udf1 = ""
    udf2 = ""
    udf3 = ""
    udf4 = ""
    udf5 = ""
    
    hash_string = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
    
    print(f"Hash String: {hash_string}")
    
    hash_object = hashlib.sha512(hash_string.encode())
    hex_dig = hash_object.hexdigest()
    
    return hex_dig

# Params from previous output
key = "OP6Zrk"
txnid = "TXN1770722421304NFEIIDV"
amount = "1499.00" 
productinfo = "Test"
firstname = "John"
email = "john@example.com"
salt = "EGhPG2OjF6DiwfTTjZmpLiYgMAA4lmt6"

calculated_hash = generate_hash(key, txnid, amount, productinfo, firstname, email, salt)
print(f"Calculated Hash: {calculated_hash}")
js_hash = "80c567465ad88fec76ba221a56ca45a1d3803ccf9de11ef69" # From JS output (truncated?)
print(f"JS Hash Match ? : {calculated_hash.startswith(js_hash)}")
