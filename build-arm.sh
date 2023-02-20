#!/bin/bash
# see: https://docs.docker.com/build/building/multi-platform/
docker buildx build --platform linux/arm64 -t ghcr.io/acm-uiuc/events-api:latest .
docker buildx build --platform linux/amd64 -t ghcr.io/acm-uiuc/events-api:latest .