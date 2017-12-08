# kerkbot
Because who doesn't have their own twitter bot.

- Create a twitter account
- Create a new app https://apps.twitter.com/
- Get your access keys and secrets
- Copy config-sample.js  to  config.js  and add your keys

Install the project

    npm install
    
Search twitter for popular tweets with the provided search word or @username

    // npm run retweet {keyword} {popular|recent|mixed) 
    npm run retweet #hashtag popular


## Dynamo DB Demo

First set up your dynamo development environment and access with these AWS steps

Setting Up DynamoDB Local   
http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html        

Setting Up DynamoDB (Web Service)
http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html

Create the Demo Database Table

    node demo/createTable.js
    
Populate the Demo with Demo Data

    node demo/populate.js
    
Run some CRUD examples

    node demo/create.js
    node demo/update.js
    node demo/read.js
    node demo/increment.js
    node demo/update2.js
    node demo/delete.js    