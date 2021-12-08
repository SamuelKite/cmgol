# Conflict + Game of Life

Creates a game of life with Red and Blue teams. When their patterns overlap, they create Green which follows game of life rules. Green then acts in additional ways:

- When green doesn't have red or blue in its square, it creates a random red or blue
- As above but then deletes itself
- If green sees blue, it makes red, if it sees red, it makes blue.

# Prereqs/setup

Node/Npm

clone repo

npm install
npm run start