FROM node:8.11.2-alpine AS image

MAINTAINER Andy Driver <andy.driver@digital.justice.gov.uk>

WORKDIR /home/cpanel

RUN apk add --no-cache yarn

ADD package.json yarn.lock ./
RUN yarn install

ADD bin bin/
ADD app app/

RUN yarn run collect-static

ENV EXPRESS_HOST "0.0.0.0"
ENV NODE_RESTART "0"

EXPOSE 3000

CMD ["/usr/local/bin/yarn", "start"]


FROM image AS test
ADD test test/
RUN yarn run test


FROM image
