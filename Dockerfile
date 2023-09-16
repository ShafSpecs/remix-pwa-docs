# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.5.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Build application
RUN npm run build

RUN npm prune --omit=dev

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "npm", "run", "start" ]
