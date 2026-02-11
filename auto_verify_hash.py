
import hashlib
import requests
import json

def generate_payu_hash_v19(key, txnid, amount, productinfo, firstname, email, phone, salt,
                            udf1='', udf2='', udf3='', udf4='', udf5='',
                            udf6='', udf7='', udf8='', udf9='', udf10='',
                            user_token='', offer_key='', offer_auto_apply='',
                            cart_details='', extra_charges=''):
    """PayU API v19 hash formula"""
    hash_string = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}|{udf6}|{udf7}|{udf8}|{udf9}|{udf10}|{user_token}|{offer_key}|{offer_auto_apply}|{cart_details}|{extra_charges}|{phone}|{salt}"
    return hashlib.sha512(hash_string.encode('utf-8')).hexdigest()

if __name__ == "__main__":
    try:
        # 1. Call our API to get a fresh hash
        response = requests.post(
            "http://localhost:3001/api/payment/initiate",
            json={
                "amount": 1499,
                "productinfo": "Test Product",
                "firstname": "John",
                "email": "john@example.com",
                "phone": "9876543210"
            },
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        data = response.json()
        print("API Response Received")

        api_txnid = data.get("txnid", "")
        api_hash = data.get("hash", "")
        api_phone = data.get("phone", "")
        api_productinfo = data.get("productinfo", "")
        api_firstname = data.get("firstname", "")
        api_email = data.get("email", "")
        api_amount = data.get("amount", "")

        print(f"API TxnID: {api_txnid}")
        print(f"API Hash: {api_hash}")

        # 2. Calculate Local Hash (API v19 formula)
        key = "OP6Zrk"
        salt = "8IWGWXbE5Q0xSFIHFXpdF5DVP7hTyOsq"

        local_hash = generate_payu_hash_v19(
            key=key,
            txnid=api_txnid,
            amount=api_amount,
            productinfo=api_productinfo,
            firstname=api_firstname,
            email=api_email,
            phone=api_phone,
            salt=salt
        )

        print(f"Local Hash: {local_hash}")

        # 3. Compare
        if api_hash == local_hash:
            print("SUCCESS: Hashes MATCH!")
            with open("verification_result.txt", "w") as f:
                f.write(f"TxnID: {api_txnid}\n")
                f.write(f"Hash: {local_hash}\n")
                f.write(f"Amount: {api_amount}\n")
                f.write(f"ProductInfo: {api_productinfo}\n")
                f.write(f"FirstName: {api_firstname}\n")
                f.write(f"Email: {api_email}\n")
                f.write(f"Phone: {api_phone}\n")
                f.write(f"Key: {key}\n")
                f.write(f"Salt: {salt}\n")
                f.write(f"Formula: API v19\n")
        else:
            print("FAILURE: Hashes MISMATCH!")
            print(f"API Hash:   {api_hash}")
            print(f"Local Hash: {local_hash}")

    except Exception as e:
        print(f"Error: {e}")
