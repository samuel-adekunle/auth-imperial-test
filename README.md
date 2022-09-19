# auth-imperial-test

To test the api to authenticate ICACS members:
```
curl --location --request GET 'https://auth-imperial-test.vercel.app/api/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "SHORTCODE",
    "password": "PASSWORD"
}'
```

Sample response:
```
{
  isICStudent: true,
  isICACSMember: true
}
```