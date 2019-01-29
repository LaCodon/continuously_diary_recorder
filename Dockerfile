FROM node:8
RUN mkdir -p /root/continuously_diary_recorder
EXPOSE 4000
ENV BOTPRESS_PORT=4000 \
    BOTPRESS_ENV=prod \
    ROCKETCHAT_URL=http://localhost:3001 \
    ROCKETCHAT_USER=diary-test \
    ROCKETCHAT_PASSWORD=diary-test \
    ROCKETCHAT_USE_SSL=false \
    ROCKETCHAT_ROOM=GENERAL \
    NLU_PROVIDER=rasa \
    NLU_RASA_URL=http://localhost:5000/
WORKDIR /root/continuously_diary_recorder
COPY . /root/continuously_diary_recorder
RUN yarn install
ENTRYPOINT ["./entrypoint.sh"]
