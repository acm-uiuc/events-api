#!/bin/bash
# see: https://docs.docker.com/build/building/multi-platform/
docker buildx create --name mycustombuilder --driver docker-container --bootstrap
docker buildx use mycustombuilder
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/acm-uiuc/events-api:latest --push .
