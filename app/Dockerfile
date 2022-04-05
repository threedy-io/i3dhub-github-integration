FROM node:11
WORKDIR /app
# # install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install  --force --silent
RUN npm install react-scripts@3.4.1  --silent
RUN npm install react-is --force  --silent
# # add app
COPY . .

# the command that starts our app
CMD ["npm", "start"]