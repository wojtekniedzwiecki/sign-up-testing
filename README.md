# sign-up-testing


## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Rename env file to .env
```bash
mv env .env
```

### 3. Create the .env.keys file in the root directory 
```bash
echo "DOTENV_PRIVATE_KEY=your-dotenv-key-here" > .env.keys
```
your-dotenv-key-here will be sent seperately via password manager app, please copy it from there


### 4. Decrypt .env file
```bash
 dotenvx decrypt
```

 if dotenvx command is not working please install npm package globally and restart terminal
 ```bash
 npm install @dotenvx/dotenvx -global     
```
 
 and then again 
 ```bash
 dotenvx decrypt
```

### 5. Check if .env file has been decrypted
 should contain 3 variables with decrypted values, withour `encrypted:` keyword
 - API_KEY
 - PLAYWRIGHT_TEST_URL_STAGING
 - PLAYWRIGHT_TEST_URL_PROD

### 6. Run tests
For staging env:
```bash
 npm run test:staging
```

For production env:
```bash
 npm run test:prod
```

## !!! Warning !!!:
Some test use the `MailSlurp` service for testing email sending, unfortunately for the assesmennt free version of `MailSlurp` is being used, this version limits the number of email to 50 per month. Could happen that if you execute the tests that send email too many time, they will start to fail.

Tests that use `MailSlurp` service and are skipped (they use `.skip` tag). To make them run remove `.skip` tag. 
```bash
test.skip('Should send email asking for confirmation after creating new account')
test.skip('Should send email to reset the password for registered email')
test.skip('Should not send email to reset the password for non-registered email')
```


