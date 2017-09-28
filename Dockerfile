FROM node:8.5.0-alpine

MAINTAINER Andy Driver <andy.driver@digital.justice.gov.uk>

WORKDIR /home/control-panel

ADD app app/
ADD package.json package.json
ADD lib lib/
ADD static static/

RUN npm install

ADD node_modules node_modules/

ENV EXPRESS_HOST "0.0.0.0"

EXPOSE 3000

CMD ["/usr/local/bin/npm", "start"]
