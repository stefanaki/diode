# Back-end

#### Deployment Instructions on localhost
1. Get NodeJS, MySQL, Redis
2. Import the database from dump file
3. Clone the codebase `git clone https://github.com/ntua/TL21-08.git`
4. Install required npm packages `cd TL21-08/backend && npm install`
5. Set your environment variables in `.env` file
6. In two seperate terminals run:
    - `redis-server`
    - `npm start`
