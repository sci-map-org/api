FROM node:14-alpine

ENV PORT 8000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk --no-cache --virtual add python make g++

# Installing dependencies
COPY yarn.lock package.json /usr/src/app/
RUN yarn install --ignore-optional --frozen-lockfile

# Copying source files
COPY . /usr/src/app/

# Building app
RUN npm run build
EXPOSE 8000

# Running the app
CMD "npm" "run" "start"