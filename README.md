# Pointrade App

requirements
`docker` and `git`

clone project 
```sh
git clone https://github.com/dotfelixb/pointrade 
```

run project
```sh
cd pointrade
docker compose up
```

apis

user registeration
```cURL
curl --location 'localhost:3000/user.register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "mike",
    "email": "mike@email.com",
    "password": "234sd.,03@"
}'
```

user verification
```cURL
curl --location --request GET 'localhost:3000/user.verify?email=mike%40email.com&token=1020' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "okay",
    "email": "okay@email.com",
    "password": "234sd.,03@"
}'
```

user login
```cURL
curl --location 'localhost:3000/user.token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "mike", 
    "password": "234sd.,03@"
}'
```

get user
```curl
curl --location --request GET 'localhost:3000/user.get?username=mike' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data-raw '{
    "username": "okay",
    "email": "okay@email.com"
}'
```

wallet deposit
```curl
curl --location 'localhost:3000/wallet.deposit' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "userid": "01HZERSAAE688JEK0Q1AP7DG29",
    "currencyid": "euro",
    "issuedkey": "EURBFAASEHD09P00K09H12DAGRVR",
    "amount": 66.99
}'
```

wallet send
```curl
curl --location 'localhost:3000/wallet.send' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "issuerid": "01HZC4R8RV5WBVRY3EFSBH7AGR",
    "issuercurrencyid": "cedis",
    "issueeid": "01HZD1ZSXQVF7MWBJXQTBE6D8W",
    "issueecurrencyid": "cedis",
    "issuedkey": "SD3BFAASEHD09P00K09H1KOL90",
    "amount": 2.98
}'
```

wallet balance
```curl
curl --location 'localhost:3000/wallet.balance' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "userid": "01HZETXY0ZFTN0QG3G48VJTTTD", 
    "currencyid": "cedi"
}'
```