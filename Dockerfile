FROM node:8.11.2-alpine AS image

LABEL maintainer="andy.driver@digital.justice.gov.uk"

ENV EXPRESS_HOST "0.0.0.0"
ENV NODE_RESTART "0"

WORKDIR /home/cpanel

RUN apk add --no-cache \
    yarn=0.23.3-r0

COPY package.json yarn.lock ./
RUN yarn install

COPY bin bin/
COPY app app/

RUN yarn run collect-static

EXPOSE 3000
CMD ["/usr/local/bin/yarn", "start"]


FROM image AS test
COPY test test/
RUN yarn run test


FROM image
