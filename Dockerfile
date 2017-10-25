FROM node:6.11.4-alpine

MAINTAINER Andy Driver <andy.driver@digital.justice.gov.uk>

WORKDIR /home/cpanel

ADD app app/
ADD bin bin/
ADD package.json package.json

RUN npm install
ADD node_modules node_modules/

RUN npm run-script collect-static
ADD static static/

ENV EXPRESS_HOST "0.0.0.0"
ENV NODE_RESTART "0"

EXPOSE 3000

CMD ["/usr/local/bin/npm", "start"]
