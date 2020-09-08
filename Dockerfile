FROM node:14

ENV PORT 8000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

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