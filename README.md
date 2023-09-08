# barrabes-challenge

## Run the app in dev mode

`npm start`

## Run the app with Docker

```
docker build -t barrabes-challenge:latest .
docker run --network=host barrabes-challenge:latest
```

## Run mocked backend service

```
cd mocks/
docker-compose up
```