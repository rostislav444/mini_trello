FROM python:3.8-slim

WORKDIR /backend

COPY requirements.txt requirements.txt
RUN apt-get update && apt-get install -y curl
RUN pip install -r requirements.txt

COPY . .
COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]
