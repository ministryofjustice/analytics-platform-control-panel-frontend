FROM node:6.11.5-alpine

MAINTAINER Andy Driver <andy.driver@digital.justice.gov.uk>

WORKDIR /home/cpanel

ADD package.json package.json
RUN npm install

ADD app app/
ADD bin bin/

RUN npm run-script collect-static

ENV EXPRESS_HOST "0.0.0.0"
ENV NODE_RESTART "0"

EXPOSE 3000

CMD ["/usr/local/bin/npm", "start"]
