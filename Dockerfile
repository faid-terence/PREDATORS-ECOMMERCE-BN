FROM node:18
# set working directory
WORKDIR /app
# 
COPY package.json .
ARG NODE_ENV 
RUN if [ "$NODE_ENV" = "development" ]; \
        then  npm install;\
        else npm install --only=production; \
        fi 
# copy all the files from your project\atlp-rwanda\ecommerce-app-predators-bn\tree\ch-project-setup-34
COPY . ./
#port the app will be running on
ENV PORT 3000
EXPOSE $PORT
CMD ["npm","start"]
