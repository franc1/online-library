FROM node:17

# Create app directory, this is in our container/in our image
WORKDIR /home/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

# EXPOSE 8080
CMD [ "node", "dist/src/main" ]
